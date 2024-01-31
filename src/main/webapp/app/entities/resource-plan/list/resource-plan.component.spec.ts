import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourcePlanService } from '../service/resource-plan.service';

import { ResourcePlanComponent } from './resource-plan.component';

describe('ResourcePlan Management Component', () => {
  let comp: ResourcePlanComponent;
  let fixture: ComponentFixture<ResourcePlanComponent>;
  let service: ResourcePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'resource-plan', component: ResourcePlanComponent }]),
        HttpClientTestingModule,
        ResourcePlanComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ResourcePlanComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourcePlanComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResourcePlanService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.resourcePlans?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to resourcePlanService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getResourcePlanIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getResourcePlanIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
