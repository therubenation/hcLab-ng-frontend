import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MeasurementApiService } from '../../measurement-api.service';
import { MeasurementSummaryDto } from '../../dto/measurement-summary.dto';
import {
  MarkCalibrationModalComponent,
  MarkCalibrationResult
} from '../../components/mark-calibration-modal/mark-calibration-modal.component';

@Component({
  selector: 'app-measurement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MarkCalibrationModalComponent],
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
  activeTab: 'ALL' | 'STANDARD' | 'CALIBRATION' = 'ALL';
  fromDate?: string;
  toDate?: string;

  // Selection and modal
  selected = new Set<string>();
  modalOpen = false;

  constructor(
    private api: MeasurementApiService,
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
        this.error = 'Konnte Messungen nicht laden.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  open(uuid: string): void {
    this.router.navigate(['/measurements', uuid]);
  }

  toggleSelection(uuid: string, checked: boolean): void {
    if (checked) {
      this.selected.add(uuid);
    } else {
      this.selected.delete(uuid);
    }
  }

  openMarkCalibrationModal(): void {
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  onMarkCalibrationConfirm(result: MarkCalibrationResult): void {
    const uuids = Array.from(this.selected);
    if (uuids.length === 0) return;

    this.loading = true;
    this.modalOpen = false;

    const requests = uuids.map(uuid => this.api.markCalibration(uuid, result.payload));

    forkJoin(requests).subscribe({
      next: () => {
        this.selected.clear();
        this.load();
      },
      error: (err) => {
        this.error = 'Fehler beim Markieren als Kalibrierung.';
        this.loading = false;
        console.error(err);
      }
    });
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
