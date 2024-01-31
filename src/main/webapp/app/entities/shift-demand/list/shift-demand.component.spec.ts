import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftDemandService } from '../service/shift-demand.service';

import { ShiftDemandComponent } from './shift-demand.component';

describe('ShiftDemand Management Component', () => {
  let comp: ShiftDemandComponent;
  let fixture: ComponentFixture<ShiftDemandComponent>;
  let service: ShiftDemandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'shift-demand', component: ShiftDemandComponent }]),
        HttpClientTestingModule,
        ShiftDemandComponent,
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
      .overrideTemplate(ShiftDemandComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftDemandComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShiftDemandService);

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
    expect(comp.shiftDemands?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shiftDemandService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShiftDemandIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShiftDemandIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
