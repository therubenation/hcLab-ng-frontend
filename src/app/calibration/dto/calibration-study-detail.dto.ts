export interface CalibrationStudyDetailDto {
  uuid: string;
  context: string;
  createdAt: string;
  electrodeBatchCode: string;
  testProtocolId: number;
  concentrationGroups: ConcentrationGroupDto[];
}

export interface ConcentrationGroupDto {
  referenceConcentration: number;
  referenceConcentrationUnit: string;
  includedCount: number;
  meanPeakCurrent: number | null;
  stddevPeakCurrent: number | null;
  measurements: StudyMeasurementDto[];
}

export interface StudyMeasurementDto {
  uuid: string;
  startTime: string;
  replicateLabel: string | null;
  batchCode: string;
  deviceSerial: string;
  peakCurrent: number | null;
  peakCurrentUnit: string | null;
  concentrationValue: number | null;
  includedInCalibration: boolean;
}
