import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRefRotation, NewRefRotation } from '../ref-rotation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRefRotation for edit and NewRefRotationFormGroupInput for create.
 */
type RefRotationFormGroupInput = IRefRotation | PartialWithRequiredKeyOf<NewRefRotation>;

type RefRotationFormDefaults = Pick<NewRefRotation, 'id'>;

type RefRotationFormGroupContent = {
  id: FormControl<IRefRotation['id'] | NewRefRotation['id']>;
  order: FormControl<IRefRotation['order']>;
  shiftType: FormControl<IRefRotation['shiftType']>;
};

export type RefRotationFormGroup = FormGroup<RefRotationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RefRotationFormService {
  createRefRotationFormGroup(refRotation: RefRotationFormGroupInput = { id: null }): RefRotationFormGroup {
    const refRotationRawValue = {
      ...this.getFormDefaults(),
      ...refRotation,
    };
    return new FormGroup<RefRotationFormGroupContent>({
      id: new FormControl(
        { value: refRotationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      order: new FormControl(refRotationRawValue.order),
      shiftType: new FormControl(refRotationRawValue.shiftType),
    });
  }

  getRefRotation(form: RefRotationFormGroup): IRefRotation | NewRefRotation {
    return form.getRawValue() as IRefRotation | NewRefRotation;
  }

  resetForm(form: RefRotationFormGroup, refRotation: RefRotationFormGroupInput): void {
    const refRotationRawValue = { ...this.getFormDefaults(), ...refRotation };
    form.reset(
      {
        ...refRotationRawValue,
        id: { value: refRotationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RefRotationFormDefaults {
    return {
      id: null,
    };
  }
}
