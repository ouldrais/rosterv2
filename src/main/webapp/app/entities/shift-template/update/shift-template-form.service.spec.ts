import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shift-template.test-samples';

import { ShiftTemplateFormService } from './shift-template-form.service';

describe('ShiftTemplate Form Service', () => {
  let service: ShiftTemplateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTemplateFormService);
  });

  describe('Service methods', () => {
    describe('createShiftTemplateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShiftTemplateFormGroup();

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

      it('passing IShiftTemplate should create a new form with FormGroup', () => {
        const formGroup = service.createShiftTemplateFormGroup(sampleWithRequiredData);

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

    describe('getShiftTemplate', () => {
      it('should return NewShiftTemplate for default ShiftTemplate initial value', () => {
        const formGroup = service.createShiftTemplateFormGroup(sampleWithNewData);

        const shiftTemplate = service.getShiftTemplate(formGroup) as any;

        expect(shiftTemplate).toMatchObject(sampleWithNewData);
      });

      it('should return NewShiftTemplate for empty ShiftTemplate initial value', () => {
        const formGroup = service.createShiftTemplateFormGroup();

        const shiftTemplate = service.getShiftTemplate(formGroup) as any;

        expect(shiftTemplate).toMatchObject({});
      });

      it('should return IShiftTemplate', () => {
        const formGroup = service.createShiftTemplateFormGroup(sampleWithRequiredData);

        const shiftTemplate = service.getShiftTemplate(formGroup) as any;

        expect(shiftTemplate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShiftTemplate should not enable id FormControl', () => {
        const formGroup = service.createShiftTemplateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShiftTemplate should disable id FormControl', () => {
        const formGroup = service.createShiftTemplateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
