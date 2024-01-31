import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TeamPlanDetailComponent } from './team-plan-detail.component';

describe('TeamPlan Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPlanDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TeamPlanDetailComponent,
              resolve: { teamPlan: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TeamPlanDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load teamPlan on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TeamPlanDetailComponent);

      // THEN
      expect(instance.teamPlan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
