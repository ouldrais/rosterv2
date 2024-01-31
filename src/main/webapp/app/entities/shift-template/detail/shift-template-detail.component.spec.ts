import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftTemplateDetailComponent } from './shift-template-detail.component';

describe('ShiftTemplate Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTemplateDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ShiftTemplateDetailComponent,
              resolve: { shiftTemplate: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ShiftTemplateDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load shiftTemplate on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ShiftTemplateDetailComponent);

      // THEN
      expect(instance.shiftTemplate).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
