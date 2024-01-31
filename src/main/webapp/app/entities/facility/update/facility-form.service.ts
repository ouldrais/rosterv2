import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFacility, NewFacility } from '../facility.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFacility for edit and NewFacilityFormGroupInput for create.
 */
type FacilityFormGroupInput = IFacility | PartialWithRequiredKeyOf<NewFacility>;

type FacilityFormDefaults = Pick<NewFacility, 'id'>;

type FacilityFormGroupContent = {
  key: FormControl<IFacility['key']>;
  id: FormControl<IFacility['id'] | NewFacility['id']>;
};

export type FacilityFormGroup = FormGroup<FacilityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FacilityFormService {
  createFacilityFormGroup(facility: FacilityFormGroupInput = { id: null }): FacilityFormGroup {
    const facilityRawValue = {
      ...this.getFormDefaults(),
      ...facility,
    };
    return new FormGroup<FacilityFormGroupContent>({
      key: new FormControl(facilityRawValue.key),
      id: new FormControl(
        { value: facilityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
    });
  }

  getFacility(form: FacilityFormGroup): IFacility | NewFacility {
    return form.getRawValue() as IFacility | NewFacility;
  }

  resetForm(form: FacilityFormGroup, facility: FacilityFormGroupInput): void {
    const facilityRawValue = { ...this.getFormDefaults(), ...facility };
    form.reset(
      {
        ...facilityRawValue,
        id: { value: facilityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FacilityFormDefaults {
    return {
      id: null,
    };
  }
}
