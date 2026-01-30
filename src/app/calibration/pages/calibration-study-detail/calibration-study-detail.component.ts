import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalibrationStudyApiService } from '../../calibration-study-api.service';
import { CalibrationStudyDetailDto } from '../../dto/calibration-study-detail.dto';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: CalibrationStudyApiService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) return;

    this.loading = true;
    this.api.getByUuid(uuid).subscribe({
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
}
