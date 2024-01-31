import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../resource-training.test-samples';

import { ResourceTrainingFormService } from './resource-training-form.service';

describe('ResourceTraining Form Service', () => {
  let service: ResourceTrainingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceTrainingFormService);
  });

  describe('Service methods', () => {
    describe('createResourceTrainingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResourceTrainingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            level: expect.any(Object),
            trainer: expect.any(Object),
            activeFrom: expect.any(Object),
            activeto: expect.any(Object),
            resource: expect.any(Object),
            training: expect.any(Object),
          }),
        );
      });

      it('passing IResourceTraining should create a new form with FormGroup', () => {
        const formGroup = service.createResourceTrainingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            status: expect.any(Object),
            level: expect.any(Object),
            trainer: expect.any(Object),
            activeFrom: expect.any(Object),
            activeto: expect.any(Object),
            resource: expect.any(Object),
            training: expect.any(Object),
          }),
        );
      });
    });

    describe('getResourceTraining', () => {
      it('should return NewResourceTraining for default ResourceTraining initial value', () => {
        const formGroup = service.createResourceTrainingFormGroup(sampleWithNewData);

        const resourceTraining = service.getResourceTraining(formGroup) as any;

        expect(resourceTraining).toMatchObject(sampleWithNewData);
      });

      it('should return NewResourceTraining for empty ResourceTraining initial value', () => {
        const formGroup = service.createResourceTrainingFormGroup();

        const resourceTraining = service.getResourceTraining(formGroup) as any;

        expect(resourceTraining).toMatchObject({});
      });

      it('should return IResourceTraining', () => {
        const formGroup = service.createResourceTrainingFormGroup(sampleWithRequiredData);

        const resourceTraining = service.getResourceTraining(formGroup) as any;

        expect(resourceTraining).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResourceTraining should not enable id FormControl', () => {
        const formGroup = service.createResourceTrainingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResourceTraining should disable id FormControl', () => {
        const formGroup = service.createResourceTrainingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
