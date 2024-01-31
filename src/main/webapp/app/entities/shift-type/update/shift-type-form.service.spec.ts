import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shift-type.test-samples';

import { ShiftTypeFormService } from './shift-type-form.service';

describe('ShiftType Form Service', () => {
  let service: ShiftTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTypeFormService);
  });

  describe('Service methods', () => {
    describe('createShiftTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShiftTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            key: expect.any(Object),
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
          }),
        );
      });

      it('passing IShiftType should create a new form with FormGroup', () => {
        const formGroup = service.createShiftTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            key: expect.any(Object),
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
          }),
        );
      });
    });

    describe('getShiftType', () => {
      it('should return NewShiftType for default ShiftType initial value', () => {
        const formGroup = service.createShiftTypeFormGroup(sampleWithNewData);

        const shiftType = service.getShiftType(formGroup) as any;

        expect(shiftType).toMatchObject(sampleWithNewData);
      });

      it('should return NewShiftType for empty ShiftType initial value', () => {
        const formGroup = service.createShiftTypeFormGroup();

        const shiftType = service.getShiftType(formGroup) as any;

        expect(shiftType).toMatchObject({});
      });

      it('should return IShiftType', () => {
        const formGroup = service.createShiftTypeFormGroup(sampleWithRequiredData);

        const shiftType = service.getShiftType(formGroup) as any;

        expect(shiftType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShiftType should not enable id FormControl', () => {
        const formGroup = service.createShiftTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShiftType should disable id FormControl', () => {
        const formGroup = service.createShiftTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
