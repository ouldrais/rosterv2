import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourcePlanDetailComponent } from './resource-plan-detail.component';

describe('ResourcePlan Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcePlanDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ResourcePlanDetailComponent,
              resolve: { resourcePlan: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ResourcePlanDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load resourcePlan on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ResourcePlanDetailComponent);

      // THEN
      expect(instance.resourcePlan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
