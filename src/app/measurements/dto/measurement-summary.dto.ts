export interface MeasurementSummaryDto {
  uuid: string;
  startTime: string;
  endTime: string | null;
  performedByRole: string;
  batchCode: string | null;
  electrodeBatchCode: string | null;
  hormoneName: string | null;
  deviceSerial: string | null;
  testProtocolId: number | null;
  measurementType: string | null;
  replicateLabel: string | null;
}
