import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MeasurementApiService } from '../../measurement-api.service';
import { MeasurementSummaryDto } from '../../dto/measurement-summary.dto';

@Component({
  selector: 'app-measurement-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './measurement-list.component.html',
})
export class MeasurementListComponent implements OnInit {
  loading = false;
  error: string | null = null;
  items: MeasurementSummaryDto[] = [];

  constructor(
    private api: MeasurementApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.api.list().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Konnte Messungen nicht laden.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  open(uuid: string): void {
    this.router.navigate(['/measurements', uuid]);
  }
}
