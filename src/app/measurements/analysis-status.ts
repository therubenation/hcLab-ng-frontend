import { AnalysisStatus } from './dto/measurement-detail.dto';

export type AnalysisStatusTone = 'success' | 'warning' | 'danger';

export const ANALYSIS_STATUS_LABELS: Record<AnalysisStatus, string> = {
  OK: 'OK',
  BELOW_CALIBRATION_RANGE: 'Below calibration range',
  ABOVE_CALIBRATION_RANGE: 'Above calibration range',
  NO_PEAK_FOUND: 'No peak found',
  TRACE_INVALID: 'Trace invalid',
  BELOW_LOQ: 'Below LOQ',
  LOW_SIGNAL_TO_NOISE: 'Low signal-to-noise',
};

const ANALYSIS_STATUS_TONES: Record<AnalysisStatus, AnalysisStatusTone> = {
  OK: 'success',
  BELOW_CALIBRATION_RANGE: 'warning',
  ABOVE_CALIBRATION_RANGE: 'warning',
  BELOW_LOQ: 'warning',
  LOW_SIGNAL_TO_NOISE: 'warning',
  NO_PEAK_FOUND: 'danger',
  TRACE_INVALID: 'danger',
};

function isKnownStatus(status: string): status is AnalysisStatus {
  return Object.prototype.hasOwnProperty.call(ANALYSIS_STATUS_LABELS, status);
}

/** Readable label; '—' when not classified, raw value for unknown (future) statuses. */
export function analysisStatusLabel(status: string | null | undefined): string {
  if (!status) return '—';
  return isKnownStatus(status) ? ANALYSIS_STATUS_LABELS[status] : status;
}

/** Badge tone for known statuses; null when not classified or unknown. */
export function analysisStatusTone(status: string | null | undefined): AnalysisStatusTone | null {
  if (!status || !isKnownStatus(status)) return null;
  return ANALYSIS_STATUS_TONES[status];
}
