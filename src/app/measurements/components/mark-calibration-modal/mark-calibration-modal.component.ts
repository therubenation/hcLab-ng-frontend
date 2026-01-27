import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkCalibrationRequestDto } from '../../dto/mark-calibration-request.dto';

export interface MarkCalibrationResult {
  payload: MarkCalibrationRequestDto;
}

@Component({
  selector: 'app-mark-calibration-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mark-calibration-modal.component.html',
  styleUrls: ['./mark-calibration-modal.component.scss']
})
export class MarkCalibrationModalComponent {
  @Input() selectedCount = 0;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<MarkCalibrationResult>();

  form = {
    referenceConcentration: null as number | null,
    referenceConcentrationUnit: 'ng/mL',
    includedInCalibration: true,
    replicateLabel: ''
  };

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.form.referenceConcentration === null || this.form.referenceConcentration <= 0) {
      alert('Target concentration must be > 0');
      return;
    }
    if (!this.form.referenceConcentrationUnit?.trim()) {
      alert('Unit is required');
      return;
    }

    const payload: MarkCalibrationRequestDto = {
      calibration: true,
      referenceConcentration: this.form.referenceConcentration,
      referenceConcentrationUnit: this.form.referenceConcentrationUnit,
      includedInCalibration: this.form.includedInCalibration,
      replicateLabel: this.form.replicateLabel?.trim() || null
    };

    this.confirm.emit({ payload });
  }
}
