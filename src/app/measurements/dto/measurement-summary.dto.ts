export interface MeasurementSummaryDto {
  uuid: string;
  startTime: string;          // ISO string
  endTime?: string | null;    // ISO string
  performedByRole: string;

  // Optional: je nachdem, was du im Summary wirklich zurückgibst
  batchCode?: string;
  deviceSerial?: string;
  hormoneName?: string;
}
