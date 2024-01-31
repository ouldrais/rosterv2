import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ResourceRolesService } from '../service/resource-roles.service';

import { ResourceRolesComponent } from './resource-roles.component';

describe('ResourceRoles Management Component', () => {
  let comp: ResourceRolesComponent;
  let fixture: ComponentFixture<ResourceRolesComponent>;
  let service: ResourceRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'resource-roles', component: ResourceRolesComponent }]),
        HttpClientTestingModule,
        ResourceRolesComponent,
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
      .overrideTemplate(ResourceRolesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourceRolesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResourceRolesService);

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
    expect(comp.resourceRoles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to resourceRolesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getResourceRolesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getResourceRolesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
