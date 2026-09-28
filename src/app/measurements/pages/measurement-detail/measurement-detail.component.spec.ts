import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MeasurementDetailComponent } from './measurement-detail.component';
import { MeasurementApiService } from '../../measurement-api.service';
import { AnalysisResultDto, MeasurementDetailDto } from '../../dto/measurement-detail.dto';

describe('MeasurementDetailComponent', () => {
  function render(analysisResult: AnalysisResultDto | null): HTMLElement {
    const dto: MeasurementDetailDto = {
      uuid: 'abc-123',
      startTime: '2026-09-01T10:00:00Z',
      performedByRole: 'SCIENTIST',
      rawSignalJson: null,
      analysisResult,
    };

    TestBed.configureTestingModule({
      imports: [MeasurementDetailComponent],
      providers: [
        provideRouter([]),
        { provide: MeasurementApiService, useValue: { getByUuid: () => of(dto) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ uuid: 'abc-123' }) } } },
      ],
    });

    const fixture = TestBed.createComponent(MeasurementDetailComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const baseResult: AnalysisResultDto = {
    source: 'MOBILE',
    analysisVersion: 'mobile-v1',
    concentrationValue: 15.75,
    concentrationUnit: 'ng/mL',
  };

  it('shows the classification label with a badge', () => {
    const el = render({ ...baseResult, status: 'BELOW_CALIBRATION_RANGE' });
    const cell = el.querySelector('[data-testid="analysis-status"]')!;
    expect(cell.textContent?.trim()).toBe('Below calibration range');
    expect(cell.querySelector('.badge.badge-warning')).not.toBeNull();
  });

  it('shows a neutral fallback when status is null', () => {
    const el = render({ ...baseResult, status: null });
    const cell = el.querySelector('[data-testid="analysis-status"]')!;
    expect(cell.textContent?.trim()).toBe('—');
    expect(cell.querySelector('.badge')).toBeNull();
  });

  it('shows the no-analysis card when analysisResult is null', () => {
    const el = render(null);
    expect(el.querySelector('[data-testid="analysis-status"]')).toBeNull();
    expect(el.textContent).toContain('No analysis result available.');
  });
});
