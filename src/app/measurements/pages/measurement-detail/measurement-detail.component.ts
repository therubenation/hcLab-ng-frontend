import { Component, OnDestroy, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

import { MeasurementApiService } from '../../measurement-api.service';
import { MeasurementDetailDto } from '../../dto/measurement-detail.dto';
import {RawSignalPayloadV1} from '../../dto/raw-signal.dto';

@Component({
  selector: 'app-measurement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './measurement-detail.component.html',
  styleUrls: ['./measurement-detail.component.scss'],
})
export class MeasurementDetailComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('signalCanvas', { static: false }) canvas?: ElementRef<HTMLCanvasElement>;

  measurement?: MeasurementDetailDto;
  rawSignal?: RawSignalPayloadV1;
  loading = false;
  error: string | null = null;

  private chart?: Chart;
  private needsChart = false;

  constructor(private route: ActivatedRoute, private api: MeasurementApiService) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) return;

    this.loading = true;
    this.error = null;

    this.api.getByUuid(uuid).subscribe({
      next: (m) => {

        console.log('measurement detail response:', m);
        console.log('analysisResult:', (m as any).analysisResult);

        this.measurement = m;
        this.rawSignal = this.parseRawSignal(m.rawSignalJson);
        this.loading = false;
        this.needsChart = true;
      },
      error: (err) => {
        this.error = 'Konnte Messung nicht laden.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.needsChart && this.canvas?.nativeElement) {
      this.needsChart = false;
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.canvas?.nativeElement) return;
    if (!this.rawSignal) return;

    this.chart?.destroy();

    const dataPoints = this.rawSignal.points.map(p => ({ x: p.x, y: p.y }));

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Raw Signal',
            data: dataPoints,
            parsing: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'linear', title: { display: true, text: this.rawSignal.xUnit } },
          y: { title: { display: true, text: this.rawSignal.yUnit } },
        },
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }

  private parseRawSignal(payload: RawSignalPayloadV1 | null): RawSignalPayloadV1 | undefined {
    if (!payload?.points?.length) return undefined;
    if (payload.formatVersion !== 1) return undefined;
    return payload;
  }
}
