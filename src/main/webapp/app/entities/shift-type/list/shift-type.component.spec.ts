import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftTypeService } from '../service/shift-type.service';

import { ShiftTypeComponent } from './shift-type.component';

describe('ShiftType Management Component', () => {
  let comp: ShiftTypeComponent;
  let fixture: ComponentFixture<ShiftTypeComponent>;
  let service: ShiftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'shift-type', component: ShiftTypeComponent }]),
        HttpClientTestingModule,
        ShiftTypeComponent,
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
      .overrideTemplate(ShiftTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShiftTypeService);

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
    expect(comp.shiftTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shiftTypeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShiftTypeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShiftTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
