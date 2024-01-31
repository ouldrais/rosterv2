import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourceTrainingDetailComponent } from './resource-training-detail.component';

describe('ResourceTraining Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceTrainingDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ResourceTrainingDetailComponent,
              resolve: { resourceTraining: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ResourceTrainingDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load resourceTraining on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ResourceTrainingDetailComponent);

      // THEN
      expect(instance.resourceTraining).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
