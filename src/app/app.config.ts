import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { MeasurementListComponent } from './measurements/pages/measurement-list/list-view/measurement-list.component';
import { MeasurementDetailComponent } from './measurements/pages/measurement-detail/measurement-detail.component';
import { CalibrationStudyDetailComponent } from './calibration/pages/calibration-study-detail/calibration-study-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'measurements', pathMatch: 'full' },
  { path: 'measurements', component: MeasurementListComponent },
  { path: 'measurements/:uuid', component: MeasurementDetailComponent },
  { path: 'calibration-studies/:uuid', component: CalibrationStudyDetailComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(), provideRouter(routes)]
};

