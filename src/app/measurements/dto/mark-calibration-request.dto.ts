export interface MarkCalibrationRequestDto {
  calibration: boolean; // true = mark calibration, false = revert to standard
  referenceConcentration?: number | null;
  referenceConcentrationUnit?: string | null;
  replicateLabel?: string | null;
  includedInCalibration?: boolean | null;
}
