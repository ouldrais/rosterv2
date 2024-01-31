import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PositionRequirementService } from '../service/position-requirement.service';

import { PositionRequirementComponent } from './position-requirement.component';

describe('PositionRequirement Management Component', () => {
  let comp: PositionRequirementComponent;
  let fixture: ComponentFixture<PositionRequirementComponent>;
  let service: PositionRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'position-requirement', component: PositionRequirementComponent }]),
        HttpClientTestingModule,
        PositionRequirementComponent,
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
      .overrideTemplate(PositionRequirementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PositionRequirementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PositionRequirementService);

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
    expect(comp.positionRequirements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to positionRequirementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPositionRequirementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPositionRequirementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
