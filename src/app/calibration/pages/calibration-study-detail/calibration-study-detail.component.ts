import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CalibrationStudyApiService } from '../../calibration-study-api.service';
import { CalibrationStudyDetailDto, ConcentrationGroupDto } from '../../dto/calibration-study-detail.dto';
import { ComputeCurveResponseDto } from '../../dto/compute-curve-response.dto';
import { MeasurementApiService } from '../../../measurements/measurement-api.service';

@Component({
  selector: 'app-calibration-study-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calibration-study-detail.component.html',
  styleUrls: ['./calibration-study-detail.component.scss']
})
export class CalibrationStudyDetailComponent implements OnInit {
  study?: CalibrationStudyDetailDto;
  loading = false;
  error: string | null = null;

  private studyUuid: string | null = null;
  togglingUuid: string | null = null;
  togglingAll = false;
  computingCurve = false;
  curveResult: ComputeCurveResponseDto | null = null;
  curveError: string | null = null;
  curveSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: CalibrationStudyApiService,
    private measurementApi: MeasurementApiService
  ) {}

  ngOnInit(): void {
    this.studyUuid = this.route.snapshot.paramMap.get('uuid');
    if (!this.studyUuid) return;
    this.loadStudy();
  }

  loadStudy(): void {
    if (!this.studyUuid) return;
    this.loading = true;
    this.api.getByUuid(this.studyUuid).subscribe({
      next: (s) => {
        this.study = s;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load calibration study.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openMeasurement(uuid: string): void {
    this.router.navigate(['/measurements', uuid]);
  }

  get totalMeasurements(): number {
    if (!this.study) return 0;
    return this.study.concentrationGroups.reduce(
      (sum, g) => sum + g.measurements.length, 0
    );
  }

  toggleInclusion(uuid: string, currentValue: boolean, event: Event): void {
    event.stopPropagation();
    if (this.togglingUuid !== null || this.togglingAll) return;

    this.togglingUuid = uuid;
    this.measurementApi.setInclusion(uuid, !currentValue).subscribe({
      next: () => {
        this.togglingUuid = null;
        this.loadStudy();
      },
      error: (err) => {
        this.togglingUuid = null;
        console.error('Failed to toggle inclusion', err);
      }
    });
  }

  isGroupAllIncluded(group: ConcentrationGroupDto): boolean {
    return group.measurements.length > 0
      && group.measurements.every(m => m.includedInCalibration);
  }

  toggleAllInGroup(group: ConcentrationGroupDto, event: Event): void {
    event.stopPropagation();
    if (this.togglingAll || this.togglingUuid !== null) return;
    if (group.measurements.length === 0) return;

    const targetValue = !this.isGroupAllIncluded(group);
    const toToggle = group.measurements.filter(m => m.includedInCalibration !== targetValue);
    if (toToggle.length === 0) return;

    this.togglingAll = true;
    forkJoin(
      toToggle.map(m => this.measurementApi.setInclusion(m.uuid, targetValue))
    ).subscribe({
      next: () => {
        this.togglingAll = false;
        this.loadStudy();
      },
      error: (err) => {
        this.togglingAll = false;
        console.error('Failed to toggle group inclusions', err);
        this.loadStudy();
      }
    });
  }

  computeCurve(): void {
    if (!this.studyUuid || this.computingCurve) return;

    this.computingCurve = true;
    this.curveError = null;
    this.curveSuccess = false;
    this.api.computeCurve(this.studyUuid).subscribe({
      next: (result) => {
        this.curveResult = result;
        this.computingCurve = false;
        this.curveSuccess = true;
      },
      error: (err) => {
        this.curveError = 'Failed to compute calibration curve.';
        this.computingCurve = false;
        console.error(err);
      }
    });
  }

  get hasIncludedMeasurements(): boolean {
    if (!this.study) return false;
    return this.study.concentrationGroups.some(g => g.includedCount > 0);
  }

  get formattedCurveData(): string {
    if (!this.curveResult?.curveData) return '';
    try {
      return JSON.stringify(JSON.parse(this.curveResult.curveData), null, 2);
    } catch {
      return this.curveResult.curveData;
    }
  }
}
