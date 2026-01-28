import { MarkCalibrationRequestDto } from './mark-calibration-request.dto';

/**
 * One item in a batch calibration request.
 * The backend endpoint expects an array of these.
 *
 * This mirrors the backend's CalibrationBatchItem record:
 *   record CalibrationBatchItem(UUID uuid, MarkCalibrationRequestDto payload) {}
 */
export interface CalibrationBatchItemDto {
  uuid: string;
  payload: MarkCalibrationRequestDto;
}
