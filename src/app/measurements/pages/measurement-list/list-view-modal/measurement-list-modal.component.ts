import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementSummaryDto } from '../../../dto/measurement-summary.dto';
import { MarkCalibrationRequestDto } from '../../../dto/mark-calibration-request.dto';

// Each row pairs a measurement with its own editable form state.
// This is the internal structure the modal works with.
export interface CalibrationRow {
  measurement: MeasurementSummaryDto;
  form: {
    referenceConcentration: number | null;
    referenceConcentrationUnit: string;
    replicateLabel: string;
  };
}

// What the modal emits back to the parent — one result per measurement.
export interface MarkCalibrationResult {
  uuid: string;
  payload: MarkCalibrationRequestDto;
}

@Component({
  selector: 'app-measurement-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './measurement-list-modal.component.html',
  styleUrls: ['./measurement-list-modal.component.scss']
})
export class MeasurementListModalComponent implements OnInit {
  // Changed: receives an array instead of a single object.
  @Input() measurements: MeasurementSummaryDto[] = [];
  @Output() cancel = new EventEmitter<void>();
  // Changed: emits an array instead of a single result.
  @Output() confirm = new EventEmitter<MarkCalibrationResult[]>();

  // Derived in ngOnInit — one row per measurement, each with its own form.
  rows: CalibrationRow[] = [];

  // ngOnInit runs once after Angular sets the @Input values.
  // This is where we "fan out" the flat measurements array
  // into rows, each carrying its own independent form defaults.
  ngOnInit(): void {
    this.rows = this.measurements.map(m => ({
      measurement: m,
      form: {
        referenceConcentration: null,
        referenceConcentrationUnit: 'ng/mL',
        replicateLabel: ''
      }
    }));
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    // Validate every row — stop at the first invalid one.
    for (const row of this.rows) {
      if (row.form.referenceConcentration === null || row.form.referenceConcentration <= 0) {
        alert(`Target concentration must be > 0 (measurement ${row.measurement.uuid.slice(0, 8)}…)`);
        return;
      }
      if (!row.form.referenceConcentrationUnit?.trim()) {
        alert(`Unit is required (measurement ${row.measurement.uuid.slice(0, 8)}…)`);
        return;
      }
    }

    // Build one result per row and emit the whole array.
    const results: MarkCalibrationResult[] = this.rows.map(row => ({
      uuid: row.measurement.uuid,
      payload: {
        calibration: true,
        referenceConcentration: row.form.referenceConcentration,
        referenceConcentrationUnit: row.form.referenceConcentrationUnit,
        replicateLabel: row.form.replicateLabel?.trim() || null
      }
    }));

    this.confirm.emit(results);
  }
}
