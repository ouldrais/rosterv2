import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShiftType, NewShiftType } from '../shift-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShiftType for edit and NewShiftTypeFormGroupInput for create.
 */
type ShiftTypeFormGroupInput = IShiftType | PartialWithRequiredKeyOf<NewShiftType>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IShiftType | NewShiftType> = Omit<T, 'start' | 'end'> & {
  start?: string | null;
  end?: string | null;
};

type ShiftTypeFormRawValue = FormValueOf<IShiftType>;

type NewShiftTypeFormRawValue = FormValueOf<NewShiftType>;

type ShiftTypeFormDefaults = Pick<NewShiftType, 'id' | 'start' | 'end'>;

type ShiftTypeFormGroupContent = {
  key: FormControl<ShiftTypeFormRawValue['key']>;
  id: FormControl<ShiftTypeFormRawValue['id'] | NewShiftType['id']>;
  start: FormControl<ShiftTypeFormRawValue['start']>;
  end: FormControl<ShiftTypeFormRawValue['end']>;
};

export type ShiftTypeFormGroup = FormGroup<ShiftTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShiftTypeFormService {
  createShiftTypeFormGroup(shiftType: ShiftTypeFormGroupInput = { id: null }): ShiftTypeFormGroup {
    const shiftTypeRawValue = this.convertShiftTypeToShiftTypeRawValue({
      ...this.getFormDefaults(),
      ...shiftType,
    });
    return new FormGroup<ShiftTypeFormGroupContent>({
      key: new FormControl(shiftTypeRawValue.key),
      id: new FormControl(
        { value: shiftTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      start: new FormControl(shiftTypeRawValue.start),
      end: new FormControl(shiftTypeRawValue.end),
    });
  }

  getShiftType(form: ShiftTypeFormGroup): IShiftType | NewShiftType {
    return this.convertShiftTypeRawValueToShiftType(form.getRawValue() as ShiftTypeFormRawValue | NewShiftTypeFormRawValue);
  }

  resetForm(form: ShiftTypeFormGroup, shiftType: ShiftTypeFormGroupInput): void {
    const shiftTypeRawValue = this.convertShiftTypeToShiftTypeRawValue({ ...this.getFormDefaults(), ...shiftType });
    form.reset(
      {
        ...shiftTypeRawValue,
        id: { value: shiftTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ShiftTypeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      start: currentTime,
      end: currentTime,
    };
  }

  private convertShiftTypeRawValueToShiftType(rawShiftType: ShiftTypeFormRawValue | NewShiftTypeFormRawValue): IShiftType | NewShiftType {
    return {
      ...rawShiftType,
      start: dayjs(rawShiftType.start, DATE_TIME_FORMAT),
      end: dayjs(rawShiftType.end, DATE_TIME_FORMAT),
    };
  }

  private convertShiftTypeToShiftTypeRawValue(
    shiftType: IShiftType | (Partial<NewShiftType> & ShiftTypeFormDefaults),
  ): ShiftTypeFormRawValue | PartialWithRequiredKeyOf<NewShiftTypeFormRawValue> {
    return {
      ...shiftType,
      start: shiftType.start ? shiftType.start.format(DATE_TIME_FORMAT) : undefined,
      end: shiftType.end ? shiftType.end.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
