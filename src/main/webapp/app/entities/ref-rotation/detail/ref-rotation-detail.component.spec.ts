import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RefRotationDetailComponent } from './ref-rotation-detail.component';

describe('RefRotation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefRotationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RefRotationDetailComponent,
              resolve: { refRotation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RefRotationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load refRotation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RefRotationDetailComponent);

      // THEN
      expect(instance.refRotation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
