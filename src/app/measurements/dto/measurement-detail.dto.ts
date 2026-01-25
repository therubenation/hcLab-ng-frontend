export interface MeasurementDetailDto {
  uuid: string;
  startTime: string;
  endTime?: string | null;
  performedByRole: string;
  effectiveParameters?: string | null;

  // kommt vom Backend aktuell als String:
  rawSignalJson: string;

  // bisschen Kontext
  deviceSerial?: string;
  batchCode?: string;
  electrodeBatchCode?: string;
  testProtocol?: { id: number; description: string; version: string };
}
