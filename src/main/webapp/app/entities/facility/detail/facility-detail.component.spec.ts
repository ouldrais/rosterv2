import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FacilityDetailComponent } from './facility-detail.component';

describe('Facility Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FacilityDetailComponent,
              resolve: { facility: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FacilityDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load facility on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FacilityDetailComponent);

      // THEN
      expect(instance.facility).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
