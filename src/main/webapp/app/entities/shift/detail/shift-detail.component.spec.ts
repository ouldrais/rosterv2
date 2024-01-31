import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftDetailComponent } from './shift-detail.component';

describe('Shift Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ShiftDetailComponent,
              resolve: { shift: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ShiftDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load shift on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ShiftDetailComponent);

      // THEN
      expect(instance.shift).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
