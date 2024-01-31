import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { IResourceRoles } from '../resource-roles.model';
import { ResourceRolesService } from '../service/resource-roles.service';
import { ResourceRolesFormService } from './resource-roles-form.service';

import { ResourceRolesUpdateComponent } from './resource-roles-update.component';

describe('ResourceRoles Management Update Component', () => {
  let comp: ResourceRolesUpdateComponent;
  let fixture: ComponentFixture<ResourceRolesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resourceRolesFormService: ResourceRolesFormService;
  let resourceRolesService: ResourceRolesService;
  let roleService: RoleService;
  let resourceService: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ResourceRolesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ResourceRolesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourceRolesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resourceRolesFormService = TestBed.inject(ResourceRolesFormService);
    resourceRolesService = TestBed.inject(ResourceRolesService);
    roleService = TestBed.inject(RoleService);
    resourceService = TestBed.inject(ResourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Role query and add missing value', () => {
      const resourceRoles: IResourceRoles = { id: 456 };
      const role: IRole = { id: 12495 };
      resourceRoles.role = role;

      const roleCollection: IRole[] = [{ id: 11761 }];
      jest.spyOn(roleService, 'query').mockReturnValue(of(new HttpResponse({ body: roleCollection })));
      const additionalRoles = [role];
      const expectedCollection: IRole[] = [...additionalRoles, ...roleCollection];
      jest.spyOn(roleService, 'addRoleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourceRoles });
      comp.ngOnInit();

      expect(roleService.query).toHaveBeenCalled();
      expect(roleService.addRoleToCollectionIfMissing).toHaveBeenCalledWith(
        roleCollection,
        ...additionalRoles.map(expect.objectContaining),
      );
      expect(comp.rolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Resource query and add missing value', () => {
      const resourceRoles: IResourceRoles = { id: 456 };
      const resource: IResource = { id: 25827 };
      resourceRoles.resource = resource;

      const resourceCollection: IResource[] = [{ id: 20568 }];
      jest.spyOn(resourceService, 'query').mockReturnValue(of(new HttpResponse({ body: resourceCollection })));
      const additionalResources = [resource];
      const expectedCollection: IResource[] = [...additionalResources, ...resourceCollection];
      jest.spyOn(resourceService, 'addResourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resourceRoles });
      comp.ngOnInit();

      expect(resourceService.query).toHaveBeenCalled();
      expect(resourceService.addResourceToCollectionIfMissing).toHaveBeenCalledWith(
        resourceCollection,
        ...additionalResources.map(expect.objectContaining),
      );
      expect(comp.resourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const resourceRoles: IResourceRoles = { id: 456 };
      const role: IRole = { id: 8499 };
      resourceRoles.role = role;
      const resource: IResource = { id: 21640 };
      resourceRoles.resource = resource;

      activatedRoute.data = of({ resourceRoles });
      comp.ngOnInit();

      expect(comp.rolesSharedCollection).toContain(role);
      expect(comp.resourcesSharedCollection).toContain(resource);
      expect(comp.resourceRoles).toEqual(resourceRoles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceRoles>>();
      const resourceRoles = { id: 123 };
      jest.spyOn(resourceRolesFormService, 'getResourceRoles').mockReturnValue(resourceRoles);
      jest.spyOn(resourceRolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceRoles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourceRoles }));
      saveSubject.complete();

      // THEN
      expect(resourceRolesFormService.getResourceRoles).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resourceRolesService.update).toHaveBeenCalledWith(expect.objectContaining(resourceRoles));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceRoles>>();
      const resourceRoles = { id: 123 };
      jest.spyOn(resourceRolesFormService, 'getResourceRoles').mockReturnValue({ id: null });
      jest.spyOn(resourceRolesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceRoles: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resourceRoles }));
      saveSubject.complete();

      // THEN
      expect(resourceRolesFormService.getResourceRoles).toHaveBeenCalled();
      expect(resourceRolesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResourceRoles>>();
      const resourceRoles = { id: 123 };
      jest.spyOn(resourceRolesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resourceRoles });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resourceRolesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRole', () => {
      it('Should forward to roleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roleService, 'compareRole');
        comp.compareRole(entity, entity2);
        expect(roleService.compareRole).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareResource', () => {
      it('Should forward to resourceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(resourceService, 'compareResource');
        comp.compareResource(entity, entity2);
        expect(resourceService.compareResource).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
