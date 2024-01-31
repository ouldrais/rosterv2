import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RefRotationService } from '../service/ref-rotation.service';

import { RefRotationComponent } from './ref-rotation.component';

describe('RefRotation Management Component', () => {
  let comp: RefRotationComponent;
  let fixture: ComponentFixture<RefRotationComponent>;
  let service: RefRotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'ref-rotation', component: RefRotationComponent }]),
        HttpClientTestingModule,
        RefRotationComponent,
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
      .overrideTemplate(RefRotationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefRotationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RefRotationService);

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
    expect(comp.refRotations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to refRotationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRefRotationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRefRotationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
