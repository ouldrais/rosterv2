import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FacilityService } from '../service/facility.service';

import { FacilityComponent } from './facility.component';

describe('Facility Management Component', () => {
  let comp: FacilityComponent;
  let fixture: ComponentFixture<FacilityComponent>;
  let service: FacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'facility', component: FacilityComponent }]),
        HttpClientTestingModule,
        FacilityComponent,
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
      .overrideTemplate(FacilityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacilityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FacilityService);

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
    expect(comp.facilities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to facilityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFacilityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFacilityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
