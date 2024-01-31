import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourceRolesDetailComponent } from './resource-roles-detail.component';

describe('ResourceRoles Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceRolesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ResourceRolesDetailComponent,
              resolve: { resourceRoles: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ResourceRolesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load resourceRoles on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ResourceRolesDetailComponent);

      // THEN
      expect(instance.resourceRoles).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
