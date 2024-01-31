import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRefCalendar, NewRefCalendar } from '../ref-calendar.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRefCalendar for edit and NewRefCalendarFormGroupInput for create.
 */
type RefCalendarFormGroupInput = IRefCalendar | PartialWithRequiredKeyOf<NewRefCalendar>;

type RefCalendarFormDefaults = Pick<NewRefCalendar, 'id'>;

type RefCalendarFormGroupContent = {
  key: FormControl<IRefCalendar['key']>;
  id: FormControl<IRefCalendar['id'] | NewRefCalendar['id']>;
  status: FormControl<IRefCalendar['status']>;
  shiftType: FormControl<IRefCalendar['shiftType']>;
};

export type RefCalendarFormGroup = FormGroup<RefCalendarFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RefCalendarFormService {
  createRefCalendarFormGroup(refCalendar: RefCalendarFormGroupInput = { id: null }): RefCalendarFormGroup {
    const refCalendarRawValue = {
      ...this.getFormDefaults(),
      ...refCalendar,
    };
    return new FormGroup<RefCalendarFormGroupContent>({
      key: new FormControl(refCalendarRawValue.key),
      id: new FormControl(
        { value: refCalendarRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      status: new FormControl(refCalendarRawValue.status),
      shiftType: new FormControl(refCalendarRawValue.shiftType),
    });
  }

  getRefCalendar(form: RefCalendarFormGroup): IRefCalendar | NewRefCalendar {
    return form.getRawValue() as IRefCalendar | NewRefCalendar;
  }

  resetForm(form: RefCalendarFormGroup, refCalendar: RefCalendarFormGroupInput): void {
    const refCalendarRawValue = { ...this.getFormDefaults(), ...refCalendar };
    form.reset(
      {
        ...refCalendarRawValue,
        id: { value: refCalendarRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RefCalendarFormDefaults {
    return {
      id: null,
    };
  }
}
