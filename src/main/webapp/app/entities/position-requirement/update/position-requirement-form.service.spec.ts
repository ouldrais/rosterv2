import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../position-requirement.test-samples';

import { PositionRequirementFormService } from './position-requirement-form.service';

describe('PositionRequirement Form Service', () => {
  let service: PositionRequirementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionRequirementFormService);
  });

  describe('Service methods', () => {
    describe('createPositionRequirementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPositionRequirementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mandatoty: expect.any(Object),
            training: expect.any(Object),
            position: expect.any(Object),
          }),
        );
      });

      it('passing IPositionRequirement should create a new form with FormGroup', () => {
        const formGroup = service.createPositionRequirementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mandatoty: expect.any(Object),
            training: expect.any(Object),
            position: expect.any(Object),
          }),
        );
      });
    });

    describe('getPositionRequirement', () => {
      it('should return NewPositionRequirement for default PositionRequirement initial value', () => {
        const formGroup = service.createPositionRequirementFormGroup(sampleWithNewData);

        const positionRequirement = service.getPositionRequirement(formGroup) as any;

        expect(positionRequirement).toMatchObject(sampleWithNewData);
      });

      it('should return NewPositionRequirement for empty PositionRequirement initial value', () => {
        const formGroup = service.createPositionRequirementFormGroup();

        const positionRequirement = service.getPositionRequirement(formGroup) as any;

        expect(positionRequirement).toMatchObject({});
      });

      it('should return IPositionRequirement', () => {
        const formGroup = service.createPositionRequirementFormGroup(sampleWithRequiredData);

        const positionRequirement = service.getPositionRequirement(formGroup) as any;

        expect(positionRequirement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPositionRequirement should not enable id FormControl', () => {
        const formGroup = service.createPositionRequirementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPositionRequirement should disable id FormControl', () => {
        const formGroup = service.createPositionRequirementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
