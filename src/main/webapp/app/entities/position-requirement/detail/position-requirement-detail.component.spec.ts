import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PositionRequirementDetailComponent } from './position-requirement-detail.component';

describe('PositionRequirement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionRequirementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PositionRequirementDetailComponent,
              resolve: { positionRequirement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PositionRequirementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load positionRequirement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PositionRequirementDetailComponent);

      // THEN
      expect(instance.positionRequirement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
