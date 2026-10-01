import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalibrationCurveDto } from './dto/calibration-curve.dto';

@Injectable({ providedIn: 'root' })
export class CalibrationCurveApiService {
  private readonly baseUrl = '/api/calibration/curves';

  constructor(private http: HttpClient) {}

  list(): Observable<CalibrationCurveDto[]> {
    return this.http.get<CalibrationCurveDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<CalibrationCurveDto> {
    return this.http.get<CalibrationCurveDto>(`${this.baseUrl}/${id}`);
  }
}
