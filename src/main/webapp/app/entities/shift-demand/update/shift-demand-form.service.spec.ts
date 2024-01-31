import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shift-demand.test-samples';

import { ShiftDemandFormService } from './shift-demand-form.service';

describe('ShiftDemand Form Service', () => {
  let service: ShiftDemandFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftDemandFormService);
  });

  describe('Service methods', () => {
    describe('createShiftDemandFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShiftDemandFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            count: expect.any(Object),
            shift: expect.any(Object),
            task: expect.any(Object),
            position: expect.any(Object),
            department: expect.any(Object),
          }),
        );
      });

      it('passing IShiftDemand should create a new form with FormGroup', () => {
        const formGroup = service.createShiftDemandFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            count: expect.any(Object),
            shift: expect.any(Object),
            task: expect.any(Object),
            position: expect.any(Object),
            department: expect.any(Object),
          }),
        );
      });
    });

    describe('getShiftDemand', () => {
      it('should return NewShiftDemand for default ShiftDemand initial value', () => {
        const formGroup = service.createShiftDemandFormGroup(sampleWithNewData);

        const shiftDemand = service.getShiftDemand(formGroup) as any;

        expect(shiftDemand).toMatchObject(sampleWithNewData);
      });

      it('should return NewShiftDemand for empty ShiftDemand initial value', () => {
        const formGroup = service.createShiftDemandFormGroup();

        const shiftDemand = service.getShiftDemand(formGroup) as any;

        expect(shiftDemand).toMatchObject({});
      });

      it('should return IShiftDemand', () => {
        const formGroup = service.createShiftDemandFormGroup(sampleWithRequiredData);

        const shiftDemand = service.getShiftDemand(formGroup) as any;

        expect(shiftDemand).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShiftDemand should not enable id FormControl', () => {
        const formGroup = service.createShiftDemandFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShiftDemand should disable id FormControl', () => {
        const formGroup = service.createShiftDemandFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
