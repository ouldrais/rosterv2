import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ref-calendar.test-samples';

import { RefCalendarFormService } from './ref-calendar-form.service';

describe('RefCalendar Form Service', () => {
  let service: RefCalendarFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefCalendarFormService);
  });

  describe('Service methods', () => {
    describe('createRefCalendarFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRefCalendarFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            key: expect.any(Object),
            id: expect.any(Object),
            status: expect.any(Object),
            shiftType: expect.any(Object),
          }),
        );
      });

      it('passing IRefCalendar should create a new form with FormGroup', () => {
        const formGroup = service.createRefCalendarFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            key: expect.any(Object),
            id: expect.any(Object),
            status: expect.any(Object),
            shiftType: expect.any(Object),
          }),
        );
      });
    });

    describe('getRefCalendar', () => {
      it('should return NewRefCalendar for default RefCalendar initial value', () => {
        const formGroup = service.createRefCalendarFormGroup(sampleWithNewData);

        const refCalendar = service.getRefCalendar(formGroup) as any;

        expect(refCalendar).toMatchObject(sampleWithNewData);
      });

      it('should return NewRefCalendar for empty RefCalendar initial value', () => {
        const formGroup = service.createRefCalendarFormGroup();

        const refCalendar = service.getRefCalendar(formGroup) as any;

        expect(refCalendar).toMatchObject({});
      });

      it('should return IRefCalendar', () => {
        const formGroup = service.createRefCalendarFormGroup(sampleWithRequiredData);

        const refCalendar = service.getRefCalendar(formGroup) as any;

        expect(refCalendar).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRefCalendar should not enable id FormControl', () => {
        const formGroup = service.createRefCalendarFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRefCalendar should disable id FormControl', () => {
        const formGroup = service.createRefCalendarFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
