import { ANALYSIS_STATUS_LABELS, analysisStatusLabel, analysisStatusTone } from './analysis-status';
import { AnalysisStatus } from './dto/measurement-detail.dto';

describe('analysis-status', () => {
  const all: AnalysisStatus[] = [
    'OK',
    'BELOW_CALIBRATION_RANGE',
    'ABOVE_CALIBRATION_RANGE',
    'NO_PEAK_FOUND',
    'TRACE_INVALID',
    'BELOW_LOQ',
    'LOW_SIGNAL_TO_NOISE',
  ];

  it('has a label and tone for every status', () => {
    for (const s of all) {
      expect(analysisStatusLabel(s)).toBe(ANALYSIS_STATUS_LABELS[s]);
      expect(analysisStatusTone(s)).not.toBeNull();
    }
  });

  it('maps known statuses to readable labels', () => {
    expect(analysisStatusLabel('OK')).toBe('OK');
    expect(analysisStatusLabel('BELOW_CALIBRATION_RANGE')).toBe('Below calibration range');
    expect(analysisStatusLabel('ABOVE_CALIBRATION_RANGE')).toBe('Above calibration range');
  });

  it('falls back to a dash when not classified', () => {
    expect(analysisStatusLabel(null)).toBe('—');
    expect(analysisStatusLabel(undefined)).toBe('—');
    expect(analysisStatusTone(null)).toBeNull();
  });

  it('shows unknown values raw without a tone', () => {
    expect(analysisStatusLabel('SOMETHING_NEW')).toBe('SOMETHING_NEW');
    expect(analysisStatusTone('SOMETHING_NEW')).toBeNull();
    expect(analysisStatusLabel('toString')).toBe('toString');
  });

  it('assigns tones', () => {
    expect(analysisStatusTone('OK')).toBe('success');
    expect(analysisStatusTone('BELOW_CALIBRATION_RANGE')).toBe('warning');
    expect(analysisStatusTone('ABOVE_CALIBRATION_RANGE')).toBe('warning');
    expect(analysisStatusTone('NO_PEAK_FOUND')).toBe('danger');
  });
});
