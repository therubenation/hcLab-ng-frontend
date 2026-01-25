export interface RawSignalPoint {
  x: number;
  y: number;
}

export interface RawSignalPayloadV1 {
  formatVersion: 1;
  xUnit: string;
  yUnit: string;
  points: RawSignalPoint[];
}
