import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ref-rotation.test-samples';

import { RefRotationFormService } from './ref-rotation-form.service';

describe('RefRotation Form Service', () => {
  let service: RefRotationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefRotationFormService);
  });

  describe('Service methods', () => {
    describe('createRefRotationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRefRotationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            order: expect.any(Object),
            shiftType: expect.any(Object),
          }),
        );
      });

      it('passing IRefRotation should create a new form with FormGroup', () => {
        const formGroup = service.createRefRotationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            order: expect.any(Object),
            shiftType: expect.any(Object),
          }),
        );
      });
    });

    describe('getRefRotation', () => {
      it('should return NewRefRotation for default RefRotation initial value', () => {
        const formGroup = service.createRefRotationFormGroup(sampleWithNewData);

        const refRotation = service.getRefRotation(formGroup) as any;

        expect(refRotation).toMatchObject(sampleWithNewData);
      });

      it('should return NewRefRotation for empty RefRotation initial value', () => {
        const formGroup = service.createRefRotationFormGroup();

        const refRotation = service.getRefRotation(formGroup) as any;

        expect(refRotation).toMatchObject({});
      });

      it('should return IRefRotation', () => {
        const formGroup = service.createRefRotationFormGroup(sampleWithRequiredData);

        const refRotation = service.getRefRotation(formGroup) as any;

        expect(refRotation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRefRotation should not enable id FormControl', () => {
        const formGroup = service.createRefRotationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRefRotation should disable id FormControl', () => {
        const formGroup = service.createRefRotationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
