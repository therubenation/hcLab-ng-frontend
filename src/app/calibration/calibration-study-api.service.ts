import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalibrationStudySummaryDto } from './dto/calibration-study-summary.dto';
import { CalibrationStudyDetailDto } from './dto/calibration-study-detail.dto';
import { CreateCalibrationStudyRequest } from './dto/create-calibration-study-request.dto';

@Injectable({ providedIn: 'root' })
export class CalibrationStudyApiService {
  private readonly baseUrl = '/api/calibration/studies';

  constructor(private http: HttpClient) {}

  list(): Observable<CalibrationStudySummaryDto[]> {
    return this.http.get<CalibrationStudySummaryDto[]>(this.baseUrl);
  }

  getByUuid(uuid: string): Observable<CalibrationStudyDetailDto> {
    return this.http.get<CalibrationStudyDetailDto>(`${this.baseUrl}/${uuid}`);
  }

  create(request: CreateCalibrationStudyRequest): Observable<CalibrationStudySummaryDto> {
    return this.http.post<CalibrationStudySummaryDto>(this.baseUrl, request);
  }
}
