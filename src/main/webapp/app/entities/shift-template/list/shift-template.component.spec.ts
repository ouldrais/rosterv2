import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShiftTemplateService } from '../service/shift-template.service';

import { ShiftTemplateComponent } from './shift-template.component';

describe('ShiftTemplate Management Component', () => {
  let comp: ShiftTemplateComponent;
  let fixture: ComponentFixture<ShiftTemplateComponent>;
  let service: ShiftTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'shift-template', component: ShiftTemplateComponent }]),
        HttpClientTestingModule,
        ShiftTemplateComponent,
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
      .overrideTemplate(ShiftTemplateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShiftTemplateService);

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
    expect(comp.shiftTemplates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shiftTemplateService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShiftTemplateIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShiftTemplateIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
