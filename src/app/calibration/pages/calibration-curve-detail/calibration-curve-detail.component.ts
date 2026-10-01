import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { CalibrationCurveApiService } from '../../calibration-curve-api.service';
import { CalibrationCurveDto, CurvePointDto } from '../../dto/calibration-curve.dto';

@Component({
  selector: 'app-calibration-curve-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calibration-curve-detail.component.html',
  styleUrls: ['./calibration-curve-detail.component.scss']
})
export class CalibrationCurveDetailComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('curveCanvas', { static: false }) canvas?: ElementRef<HTMLCanvasElement>;

  curve?: CalibrationCurveDto;
  points: CurvePointDto[] = [];
  formattedCurveData = '';
  loading = false;
  error: string | null = null;

  private chart?: Chart;
  private needsChart = false;

  constructor(private route: ActivatedRoute, private api: CalibrationCurveApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;
    this.api.getById(id).subscribe({
      next: (c) => {
        this.curve = c;
        this.points = this.parsePoints(c.curveData);
        this.formattedCurveData = this.formatJson(c.curveData);
        this.loading = false;
        this.needsChart = this.points.length > 0;
      },
      error: (err) => {
        this.error = 'Could not load calibration curve.';
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

  get concentrationUnit(): string {
    return this.points[0]?.unit ?? '';
  }

  private renderChart(): void {
    if (!this.canvas?.nativeElement) return;

    this.chart?.destroy();

    const meanPoints = this.points.map(p => ({ x: p.concentration, y: p.meanPeak }));

    // ±1 stddev as vertical segments; a null y breaks the line between points
    const errorBars: { x: number; y: number | null }[] = [];
    for (const p of this.points) {
      if (p.stddevPeak == null) continue;
      errorBars.push({ x: p.concentration, y: p.meanPeak - p.stddevPeak });
      errorBars.push({ x: p.concentration, y: p.meanPeak + p.stddevPeak });
      errorBars.push({ x: p.concentration, y: null });
    }

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Mean peak current',
            data: meanPoints,
            parsing: false,
            pointRadius: 4,
          },
          {
            label: '± 1 SD',
            data: errorBars,
            parsing: false,
            pointRadius: 0,
            spanGaps: false,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'linear', title: { display: true, text: `Concentration (${this.concentrationUnit})` } },
          y: { title: { display: true, text: 'Peak current' } },
        },
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }

  private parsePoints(curveData: string): CurvePointDto[] {
    try {
      const parsed = JSON.parse(curveData);
      if (!Array.isArray(parsed)) return [];
      const points = parsed.filter(
        p => typeof p?.concentration === 'number' && typeof p?.meanPeak === 'number'
      ) as CurvePointDto[];
      return points.sort((a, b) => a.concentration - b.concentration);
    } catch {
      return [];
    }
  }

  private formatJson(raw: string): string {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
}
