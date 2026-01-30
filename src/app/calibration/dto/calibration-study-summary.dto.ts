export interface CalibrationStudySummaryDto {
  uuid: string;
  context: string;
  createdAt: string;
  electrodeBatchCode: string;
  testProtocolId: number;
  measurementCount: number;
}
