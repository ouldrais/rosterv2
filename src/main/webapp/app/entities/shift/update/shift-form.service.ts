import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShift, NewShift } from '../shift.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShift for edit and NewShiftFormGroupInput for create.
 */
type ShiftFormGroupInput = IShift | PartialWithRequiredKeyOf<NewShift>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IShift | NewShift> = Omit<T, 'shiftStart' | 'shiftEnd'> & {
  shiftStart?: string | null;
  shiftEnd?: string | null;
};

type ShiftFormRawValue = FormValueOf<IShift>;

type NewShiftFormRawValue = FormValueOf<NewShift>;

type ShiftFormDefaults = Pick<NewShift, 'id' | 'shiftStart' | 'shiftEnd'>;

type ShiftFormGroupContent = {
  id: FormControl<ShiftFormRawValue['id'] | NewShift['id']>;
  key: FormControl<ShiftFormRawValue['key']>;
  shiftStart: FormControl<ShiftFormRawValue['shiftStart']>;
  shiftEnd: FormControl<ShiftFormRawValue['shiftEnd']>;
  type: FormControl<ShiftFormRawValue['type']>;
};

export type ShiftFormGroup = FormGroup<ShiftFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShiftFormService {
  createShiftFormGroup(shift: ShiftFormGroupInput = { id: null }): ShiftFormGroup {
    const shiftRawValue = this.convertShiftToShiftRawValue({
      ...this.getFormDefaults(),
      ...shift,
    });
    return new FormGroup<ShiftFormGroupContent>({
      id: new FormControl(
        { value: shiftRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      key: new FormControl(shiftRawValue.key),
      shiftStart: new FormControl(shiftRawValue.shiftStart),
      shiftEnd: new FormControl(shiftRawValue.shiftEnd),
      type: new FormControl(shiftRawValue.type),
    });
  }

  getShift(form: ShiftFormGroup): IShift | NewShift {
    return this.convertShiftRawValueToShift(form.getRawValue() as ShiftFormRawValue | NewShiftFormRawValue);
  }

  resetForm(form: ShiftFormGroup, shift: ShiftFormGroupInput): void {
    const shiftRawValue = this.convertShiftToShiftRawValue({ ...this.getFormDefaults(), ...shift });
    form.reset(
      {
        ...shiftRawValue,
        id: { value: shiftRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ShiftFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      shiftStart: currentTime,
      shiftEnd: currentTime,
    };
  }

  private convertShiftRawValueToShift(rawShift: ShiftFormRawValue | NewShiftFormRawValue): IShift | NewShift {
    return {
      ...rawShift,
      shiftStart: dayjs(rawShift.shiftStart, DATE_TIME_FORMAT),
      shiftEnd: dayjs(rawShift.shiftEnd, DATE_TIME_FORMAT),
    };
  }

  private convertShiftToShiftRawValue(
    shift: IShift | (Partial<NewShift> & ShiftFormDefaults),
  ): ShiftFormRawValue | PartialWithRequiredKeyOf<NewShiftFormRawValue> {
    return {
      ...shift,
      shiftStart: shift.shiftStart ? shift.shiftStart.format(DATE_TIME_FORMAT) : undefined,
      shiftEnd: shift.shiftEnd ? shift.shiftEnd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
