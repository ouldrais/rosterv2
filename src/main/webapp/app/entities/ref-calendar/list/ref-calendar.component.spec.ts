import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RefCalendarService } from '../service/ref-calendar.service';

import { RefCalendarComponent } from './ref-calendar.component';

describe('RefCalendar Management Component', () => {
  let comp: RefCalendarComponent;
  let fixture: ComponentFixture<RefCalendarComponent>;
  let service: RefCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'ref-calendar', component: RefCalendarComponent }]),
        HttpClientTestingModule,
        RefCalendarComponent,
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
      .overrideTemplate(RefCalendarComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefCalendarComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RefCalendarService);

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
    expect(comp.refCalendars?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to refCalendarService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRefCalendarIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRefCalendarIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
