import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RefCalendarDetailComponent } from './ref-calendar-detail.component';

describe('RefCalendar Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefCalendarDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RefCalendarDetailComponent,
              resolve: { refCalendar: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RefCalendarDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load refCalendar on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RefCalendarDetailComponent);

      // THEN
      expect(instance.refCalendar).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
