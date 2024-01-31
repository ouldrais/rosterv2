import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourceTrainingService } from '../service/resource-training.service';

import { ResourceTrainingComponent } from './resource-training.component';

describe('ResourceTraining Management Component', () => {
  let comp: ResourceTrainingComponent;
  let fixture: ComponentFixture<ResourceTrainingComponent>;
  let service: ResourceTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'resource-training', component: ResourceTrainingComponent }]),
        HttpClientTestingModule,
        ResourceTrainingComponent,
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
      .overrideTemplate(ResourceTrainingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourceTrainingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResourceTrainingService);

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
    expect(comp.resourceTrainings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to resourceTrainingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getResourceTrainingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getResourceTrainingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
