import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MeasurementApiService } from '../../../measurement-api.service';
import { MeasurementSummaryDto } from '../../../dto/measurement-summary.dto';
import { CalibrationBatchItemDto } from '../../../dto/calibration-batch-item.dto';
import {
  MeasurementListModalComponent,
  MarkCalibrationResult
} from '../../../components/mark-calibration-modal/measurement-list-modal.component';
import { CalibrationStudyApiService } from '../../../../calibration/calibration-study-api.service';
import { CalibrationStudySummaryDto } from '../../../../calibration/dto/calibration-study-summary.dto';

@Component({
  selector: 'app-measurement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MeasurementListModalComponent],
  templateUrl: './measurement-list.component.html',
  styleUrls: ['./measurement-list.component.scss']
})
export class MeasurementListComponent implements OnInit {
  loading = false;
  error: string | null = null;
  items: MeasurementSummaryDto[] = [];

  // Filter & search state
  query = '';
  electrodeBatchFilter = '';
  activeTab: 'ALL' | 'STANDARD' | 'CALIBRATION' | 'STUDIES' = 'ALL';
  fromDate?: string;
  toDate?: string;

  // Selection and modal
  selected = new Set<string>();
  modalOpen = false;
  modalMeasurements: MeasurementSummaryDto[] = [];

  // Studies tab
  studies: CalibrationStudySummaryDto[] = [];
  studiesLoaded = false;

  constructor(
    private api: MeasurementApiService,
    private calibrationStudyApi: CalibrationStudyApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.api.list().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load measurements.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  open(uuid: string): void {
    this.router.navigate(['/measurements', uuid]);
  }

  switchTab(tab: 'ALL' | 'STANDARD' | 'CALIBRATION' | 'STUDIES'): void {
    this.activeTab = tab;
    this.selected.clear();
    if (tab === 'STUDIES' && !this.studiesLoaded) {
      this.loadStudies();
    }
  }

  loadStudies(): void {
    this.loading = true;
    this.calibrationStudyApi.list().subscribe({
      next: (data) => {
        this.studies = data;
        this.studiesLoaded = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load calibration studies.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openStudy(uuid: string): void {
    this.router.navigate(['/calibration-studies', uuid]);
  }

  toggleSelection(uuid: string, checked: boolean): void {
    if (checked) {
      this.selected.add(uuid);
    } else {
      this.selected.delete(uuid);
    }
  }

  isSelectable(m: MeasurementSummaryDto): boolean {
    switch (this.activeTab) {
      case 'STANDARD': return m.measurementType === 'STANDARD';
      case 'CALIBRATION': return m.measurementType === 'CALIBRATION';
      case 'ALL': return true;
      case 'STUDIES': return false;
    }
  }

  get selectedStandardCount(): number {
    return this.items.filter(
      m => this.selected.has(m.uuid) && m.measurementType === 'STANDARD'
    ).length;
  }

  get selectedCalibrationCount(): number {
    return this.items.filter(
      m => this.selected.has(m.uuid) && m.measurementType === 'CALIBRATION'
    ).length;
  }

  openMarkCalibrationModal(): void {
    this.modalMeasurements = this.items.filter(
      m => this.selected.has(m.uuid) && m.measurementType === 'STANDARD'
    );
    if (this.modalMeasurements.length === 0) return;

    this.modalOpen = true;
  }

  confirmRevertToStandard(): void {
    const calibrationItems = this.items.filter(
      m => this.selected.has(m.uuid) && m.measurementType === 'CALIBRATION'
    );
    if (calibrationItems.length === 0) return;

    const ok = confirm(
      `Revert ${calibrationItems.length} measurement(s) to STANDARD?\n\n` +
      'Calibration data (reference concentration, unit, replicate label) will be removed.'
    );
    if (!ok) return;

    const batch: CalibrationBatchItemDto[] = calibrationItems.map(m => ({
      uuid: m.uuid,
      payload: {
        calibration: false,
        referenceConcentration: null,
        referenceConcentrationUnit: null,
        replicateLabel: null
      }
    }));

    this.loading = true;
    this.api.markCalibrationBatch(batch).subscribe({
      next: () => {
        this.selected.clear();
        this.load();
      },
      error: (err) => {
        this.error = 'Error reverting to standard.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createCalibrationStudy(): void {
    const calibrationUuids = this.items
      .filter(m => this.selected.has(m.uuid) && m.measurementType === 'CALIBRATION')
      .map(m => m.uuid);

    if (calibrationUuids.length === 0) return;

    const context = prompt('Enter a description for this calibration study:');
    if (!context?.trim()) return;

    this.loading = true;
    this.calibrationStudyApi.create({
      context: context.trim(),
      measurementUuids: calibrationUuids
    }).subscribe({
      next: (study) => {
        this.selected.clear();
        this.router.navigate(['/calibration-studies', study.uuid]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error creating calibration study.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.modalMeasurements = [];
  }

  // Receives an array from the modal — one result per row.
  // Sends it as a single batch request to the backend.
  onMarkCalibrationConfirm(results: MarkCalibrationResult[]): void {
    this.loading = true;
    this.modalOpen = false;
    this.modalMeasurements = [];

    // Ein einziger API-Call für alle Messungen.
    // Das Backend verarbeitet sie in einer Transaktion (all-or-nothing).
    this.api.markCalibrationBatch(results).subscribe({
      next: () => {
        this.selected.clear();
        this.load();
      },
      error: (err) => {
        this.error = 'Error during marking as calibration.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get allFilteredSelected(): boolean {
    const items = this.filteredItems;
    return items.length > 0 && items.every(m => this.selected.has(m.uuid));
  }

  toggleSelectAll(checked: boolean): void {
    const items = this.filteredItems;
    if (checked) {
      items.forEach(m => this.selected.add(m.uuid));
    } else {
      items.forEach(m => this.selected.delete(m.uuid));
    }
  }

  trackByUuid(_: number, m: { uuid: string }): string {
    return m.uuid;
  }

  get filteredItems(): MeasurementSummaryDto[] {
    let result = this.items ?? [];

    // Tab filter
    if (this.activeTab === 'STANDARD') {
      result = result.filter(m => m.measurementType === 'STANDARD');
    } else if (this.activeTab === 'CALIBRATION') {
      result = result.filter(m => m.measurementType === 'CALIBRATION');
    }

    // Search query filter (UUID/batch/electrode)
    const q = (this.query ?? '').trim().toLowerCase();
    if (q) {
      result = result.filter(m =>
        (m.uuid ?? '').toLowerCase().includes(q) ||
        (m.batchCode ?? '').toLowerCase().includes(q) ||
        (m.electrodeBatchCode ?? '').toLowerCase().includes(q)
      );
    }

    // Electrode batch filter
    const eb = (this.electrodeBatchFilter ?? '').trim().toLowerCase();
    if (eb) {
      result = result.filter(m =>
        (m.electrodeBatchCode ?? '').toLowerCase().includes(eb)
      );
    }

    // Date range filter
    if (this.fromDate) {
      const from = new Date(this.fromDate);
      result = result.filter(m => new Date(m.startTime) >= from);
    }

    if (this.toDate) {
      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter(m => new Date(m.startTime) <= to);
    }

    // Sort by startTime desc (newest first)
    return [...result].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }
}
