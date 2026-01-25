import { Routes } from '@angular/router';
import { MeasurementListComponent } from './pages/measurement-list/measurement-list.component';
import { MeasurementDetailComponent } from './pages/measurement-detail/measurement-detail.component';

export const MEASUREMENT_ROUTES: Routes = [
  { path: 'measurements', component: MeasurementListComponent },
  { path: 'measurements/:uuid', component: MeasurementDetailComponent },
];
