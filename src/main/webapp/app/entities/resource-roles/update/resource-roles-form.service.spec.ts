import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resource-roles.test-samples';

import { ResourceRolesFormService } from './resource-roles-form.service';

describe('ResourceRoles Form Service', () => {
  let service: ResourceRolesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceRolesFormService);
  });

  describe('Service methods', () => {
    describe('createResourceRolesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResourceRolesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            role: expect.any(Object),
            resource: expect.any(Object),
          }),
        );
      });

      it('passing IResourceRoles should create a new form with FormGroup', () => {
        const formGroup = service.createResourceRolesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            role: expect.any(Object),
            resource: expect.any(Object),
          }),
        );
      });
    });

    describe('getResourceRoles', () => {
      it('should return NewResourceRoles for default ResourceRoles initial value', () => {
        const formGroup = service.createResourceRolesFormGroup(sampleWithNewData);

        const resourceRoles = service.getResourceRoles(formGroup) as any;

        expect(resourceRoles).toMatchObject(sampleWithNewData);
      });

      it('should return NewResourceRoles for empty ResourceRoles initial value', () => {
        const formGroup = service.createResourceRolesFormGroup();

        const resourceRoles = service.getResourceRoles(formGroup) as any;

        expect(resourceRoles).toMatchObject({});
      });

      it('should return IResourceRoles', () => {
        const formGroup = service.createResourceRolesFormGroup(sampleWithRequiredData);

        const resourceRoles = service.getResourceRoles(formGroup) as any;

        expect(resourceRoles).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResourceRoles should not enable id FormControl', () => {
        const formGroup = service.createResourceRolesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResourceRoles should disable id FormControl', () => {
        const formGroup = service.createResourceRolesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
