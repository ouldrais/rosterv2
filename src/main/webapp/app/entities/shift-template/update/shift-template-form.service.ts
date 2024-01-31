import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShiftTemplate, NewShiftTemplate } from '../shift-template.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShiftTemplate for edit and NewShiftTemplateFormGroupInput for create.
 */
type ShiftTemplateFormGroupInput = IShiftTemplate | PartialWithRequiredKeyOf<NewShiftTemplate>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IShiftTemplate | NewShiftTemplate> = Omit<T, 'shiftStart' | 'shiftEnd'> & {
  shiftStart?: string | null;
  shiftEnd?: string | null;
};

type ShiftTemplateFormRawValue = FormValueOf<IShiftTemplate>;

type NewShiftTemplateFormRawValue = FormValueOf<NewShiftTemplate>;

type ShiftTemplateFormDefaults = Pick<NewShiftTemplate, 'id' | 'shiftStart' | 'shiftEnd'>;

type ShiftTemplateFormGroupContent = {
  id: FormControl<ShiftTemplateFormRawValue['id'] | NewShiftTemplate['id']>;
  key: FormControl<ShiftTemplateFormRawValue['key']>;
  shiftStart: FormControl<ShiftTemplateFormRawValue['shiftStart']>;
  shiftEnd: FormControl<ShiftTemplateFormRawValue['shiftEnd']>;
  type: FormControl<ShiftTemplateFormRawValue['type']>;
};

export type ShiftTemplateFormGroup = FormGroup<ShiftTemplateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShiftTemplateFormService {
  createShiftTemplateFormGroup(shiftTemplate: ShiftTemplateFormGroupInput = { id: null }): ShiftTemplateFormGroup {
    const shiftTemplateRawValue = this.convertShiftTemplateToShiftTemplateRawValue({
      ...this.getFormDefaults(),
      ...shiftTemplate,
    });
    return new FormGroup<ShiftTemplateFormGroupContent>({
      id: new FormControl(
        { value: shiftTemplateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      key: new FormControl(shiftTemplateRawValue.key),
      shiftStart: new FormControl(shiftTemplateRawValue.shiftStart),
      shiftEnd: new FormControl(shiftTemplateRawValue.shiftEnd),
      type: new FormControl(shiftTemplateRawValue.type),
    });
  }

  getShiftTemplate(form: ShiftTemplateFormGroup): IShiftTemplate | NewShiftTemplate {
    return this.convertShiftTemplateRawValueToShiftTemplate(form.getRawValue() as ShiftTemplateFormRawValue | NewShiftTemplateFormRawValue);
  }

  resetForm(form: ShiftTemplateFormGroup, shiftTemplate: ShiftTemplateFormGroupInput): void {
    const shiftTemplateRawValue = this.convertShiftTemplateToShiftTemplateRawValue({ ...this.getFormDefaults(), ...shiftTemplate });
    form.reset(
      {
        ...shiftTemplateRawValue,
        id: { value: shiftTemplateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ShiftTemplateFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      shiftStart: currentTime,
      shiftEnd: currentTime,
    };
  }

  private convertShiftTemplateRawValueToShiftTemplate(
    rawShiftTemplate: ShiftTemplateFormRawValue | NewShiftTemplateFormRawValue,
  ): IShiftTemplate | NewShiftTemplate {
    return {
      ...rawShiftTemplate,
      shiftStart: dayjs(rawShiftTemplate.shiftStart, DATE_TIME_FORMAT),
      shiftEnd: dayjs(rawShiftTemplate.shiftEnd, DATE_TIME_FORMAT),
    };
  }

  private convertShiftTemplateToShiftTemplateRawValue(
    shiftTemplate: IShiftTemplate | (Partial<NewShiftTemplate> & ShiftTemplateFormDefaults),
  ): ShiftTemplateFormRawValue | PartialWithRequiredKeyOf<NewShiftTemplateFormRawValue> {
    return {
      ...shiftTemplate,
      shiftStart: shiftTemplate.shiftStart ? shiftTemplate.shiftStart.format(DATE_TIME_FORMAT) : undefined,
      shiftEnd: shiftTemplate.shiftEnd ? shiftTemplate.shiftEnd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
