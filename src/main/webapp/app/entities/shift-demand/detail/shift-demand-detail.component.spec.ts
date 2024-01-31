import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftDemandDetailComponent } from './shift-demand-detail.component';

describe('ShiftDemand Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftDemandDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ShiftDemandDetailComponent,
              resolve: { shiftDemand: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ShiftDemandDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load shiftDemand on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ShiftDemandDetailComponent);

      // THEN
      expect(instance.shiftDemand).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
