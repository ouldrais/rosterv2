import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TeamPlanService } from '../service/team-plan.service';

import { TeamPlanComponent } from './team-plan.component';

describe('TeamPlan Management Component', () => {
  let comp: TeamPlanComponent;
  let fixture: ComponentFixture<TeamPlanComponent>;
  let service: TeamPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'team-plan', component: TeamPlanComponent }]),
        HttpClientTestingModule,
        TeamPlanComponent,
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
      .overrideTemplate(TeamPlanComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TeamPlanComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TeamPlanService);

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
    expect(comp.teamPlans?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to teamPlanService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTeamPlanIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTeamPlanIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
