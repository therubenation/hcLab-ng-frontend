export interface CalibrationCurveDto {
  id: number;
  validFrom: string;
  validTo: string | null;
  curveModelType: string;
  curveData: string;
  parameterSignature: string;
  analyte: CurveAnalyteDto | null;
  electrodeBatch: CurveElectrodeBatchDto | null;
  calibrationStudy: CurveStudyDto | null;
}

export interface CurveAnalyteDto {
  id: number;
  name: string;
  defaultUnit: string;
}

export interface CurveElectrodeBatchDto {
  id: number;
  electrodeBatchCode: string;
  description: string | null;
}

export interface CurveStudyDto {
  uuid: string;
  context: string;
  createdAt: string;
  electrodeBatchCode: string;
  testProtocolId: number;
}

/** One aggregated point of a 'point-aggregation' curve (see backend computeCurveForStudy). */
export interface CurvePointDto {
  concentration: number;
  unit: string;
  n: number;
  meanPeak: number;
  stddevPeak: number | null;
}
