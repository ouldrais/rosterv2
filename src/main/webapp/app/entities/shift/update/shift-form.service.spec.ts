import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shift.test-samples';

import { ShiftFormService } from './shift-form.service';

describe('Shift Form Service', () => {
  let service: ShiftFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftFormService);
  });

  describe('Service methods', () => {
    describe('createShiftFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShiftFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            shiftStart: expect.any(Object),
            shiftEnd: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });

      it('passing IShift should create a new form with FormGroup', () => {
        const formGroup = service.createShiftFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            shiftStart: expect.any(Object),
            shiftEnd: expect.any(Object),
            type: expect.any(Object),
          }),
        );
      });
    });

    describe('getShift', () => {
      it('should return NewShift for default Shift initial value', () => {
        const formGroup = service.createShiftFormGroup(sampleWithNewData);

        const shift = service.getShift(formGroup) as any;

        expect(shift).toMatchObject(sampleWithNewData);
      });

      it('should return NewShift for empty Shift initial value', () => {
        const formGroup = service.createShiftFormGroup();

        const shift = service.getShift(formGroup) as any;

        expect(shift).toMatchObject({});
      });

      it('should return IShift', () => {
        const formGroup = service.createShiftFormGroup(sampleWithRequiredData);

        const shift = service.getShift(formGroup) as any;

        expect(shift).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShift should not enable id FormControl', () => {
        const formGroup = service.createShiftFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShift should disable id FormControl', () => {
        const formGroup = service.createShiftFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
