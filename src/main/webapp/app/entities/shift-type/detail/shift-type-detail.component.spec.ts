import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftTypeDetailComponent } from './shift-type-detail.component';

describe('ShiftType Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTypeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ShiftTypeDetailComponent,
              resolve: { shiftType: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ShiftTypeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load shiftType on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ShiftTypeDetailComponent);

      // THEN
      expect(instance.shiftType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
