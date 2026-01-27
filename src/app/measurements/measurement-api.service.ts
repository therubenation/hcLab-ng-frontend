import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeasurementSummaryDto } from './dto/measurement-summary.dto';
import { MeasurementDetailDto } from './dto/measurement-detail.dto';
import {MarkCalibrationRequestDto} from './dto/mark-calibration-request.dto';

@Injectable({ providedIn: 'root' })
export class MeasurementApiService {
  private readonly baseUrl = '/api/measurements';

  constructor(private http: HttpClient) {}

  list(): Observable<MeasurementSummaryDto[]> {
    return this.http.get<MeasurementSummaryDto[]>(this.baseUrl);
  }

  getByUuid(uuid: string): Observable<MeasurementDetailDto> {
    return this.http.get<MeasurementDetailDto>(`${this.baseUrl}/${uuid}`);
  }

  markCalibration(uuid: string, payload: MarkCalibrationRequestDto) {
    return this.http.patch<MeasurementDetailDto>(
      `${this.baseUrl}/${uuid}/mark-calibration`,
      payload
    );
  }
}
