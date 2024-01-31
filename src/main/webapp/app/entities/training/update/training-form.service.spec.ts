import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../training.test-samples';

import { TrainingFormService } from './training-form.service';

describe('Training Form Service', () => {
  let service: TrainingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingFormService);
  });

  describe('Service methods', () => {
    describe('createTrainingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTrainingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing ITraining should create a new form with FormGroup', () => {
        const formGroup = service.createTrainingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getTraining', () => {
      it('should return NewTraining for default Training initial value', () => {
        const formGroup = service.createTrainingFormGroup(sampleWithNewData);

        const training = service.getTraining(formGroup) as any;

        expect(training).toMatchObject(sampleWithNewData);
      });

      it('should return NewTraining for empty Training initial value', () => {
        const formGroup = service.createTrainingFormGroup();

        const training = service.getTraining(formGroup) as any;

        expect(training).toMatchObject({});
      });

      it('should return ITraining', () => {
        const formGroup = service.createTrainingFormGroup(sampleWithRequiredData);

        const training = service.getTraining(formGroup) as any;

        expect(training).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITraining should not enable id FormControl', () => {
        const formGroup = service.createTrainingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTraining should disable id FormControl', () => {
        const formGroup = service.createTrainingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
