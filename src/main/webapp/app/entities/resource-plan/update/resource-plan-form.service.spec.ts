import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resource-plan.test-samples';

import { ResourcePlanFormService } from './resource-plan-form.service';

describe('ResourcePlan Form Service', () => {
  let service: ResourcePlanFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcePlanFormService);
  });

  describe('Service methods', () => {
    describe('createResourcePlanFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResourcePlanFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            availability: expect.any(Object),
            resource: expect.any(Object),
            shift: expect.any(Object),
            position: expect.any(Object),
          }),
        );
      });

      it('passing IResourcePlan should create a new form with FormGroup', () => {
        const formGroup = service.createResourcePlanFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            availability: expect.any(Object),
            resource: expect.any(Object),
            shift: expect.any(Object),
            position: expect.any(Object),
          }),
        );
      });
    });

    describe('getResourcePlan', () => {
      it('should return NewResourcePlan for default ResourcePlan initial value', () => {
        const formGroup = service.createResourcePlanFormGroup(sampleWithNewData);

        const resourcePlan = service.getResourcePlan(formGroup) as any;

        expect(resourcePlan).toMatchObject(sampleWithNewData);
      });

      it('should return NewResourcePlan for empty ResourcePlan initial value', () => {
        const formGroup = service.createResourcePlanFormGroup();

        const resourcePlan = service.getResourcePlan(formGroup) as any;

        expect(resourcePlan).toMatchObject({});
      });

      it('should return IResourcePlan', () => {
        const formGroup = service.createResourcePlanFormGroup(sampleWithRequiredData);

        const resourcePlan = service.getResourcePlan(formGroup) as any;

        expect(resourcePlan).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResourcePlan should not enable id FormControl', () => {
        const formGroup = service.createResourcePlanFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResourcePlan should disable id FormControl', () => {
        const formGroup = service.createResourcePlanFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
