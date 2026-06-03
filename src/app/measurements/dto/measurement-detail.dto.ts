import { RawSignalPayloadV1 } from './raw-signal.dto';

export interface AnalysisResultDto {
  source?: string | null;
  analysisVersion?: string | null;
  peakCurrent?: number | null;
  peakCurrentUnit?: string | null;
  peakPotential?: number | null;
  peakPotentialUnit?: string | null;
  concentrationValue?: number | null;
  concentrationUnit?: string | null;
  qualityScore?: number | null;
}

export interface MeasurementDetailDto {
  uuid: string;
  startTime: string;
  endTime?: string | null;
  performedByRole: string;
  effectiveParameters?: string | null;

  rawSignalJson: RawSignalPayloadV1 | null;

  // Measurement classification
  measurementType?: string | null;

  // Calibration-specific fields
  referenceConcentration?: number | null;
  referenceConcentrationUnit?: string | null;
  replicateLabel?: string | null;

  // Device context
  deviceSerial?: string | null;
  deviceModel?: string | null;

  // Cartridge / batch context
  batchCode?: string | null;
  cartridgeProductCode?: string | null;
  electrodeBatchCode?: string | null;

  // Hormone
  hormoneName?: string | null;
  hormoneUnit?: string | null;

  // Test protocol (flat fields matching backend record)
  testProtocolId?: number | null;
  testMethod?: string | null;
  testProtocolVersion?: string | null;

  // Operator
  operatorEmail?: string | null;

  // AnaylsisResult
  analysisResult?: AnalysisResultDto | null;

}


