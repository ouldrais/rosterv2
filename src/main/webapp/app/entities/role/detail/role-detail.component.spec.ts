import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RoleDetailComponent } from './role-detail.component';

describe('Role Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RoleDetailComponent,
              resolve: { role: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RoleDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load role on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RoleDetailComponent);

      // THEN
      expect(instance.role).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
