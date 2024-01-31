import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourceDetailComponent } from './resource-detail.component';

describe('Resource Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ResourceDetailComponent,
              resolve: { resource: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ResourceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load resource on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ResourceDetailComponent);

      // THEN
      expect(instance.resource).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
