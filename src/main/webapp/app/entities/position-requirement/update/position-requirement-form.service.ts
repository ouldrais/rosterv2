import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPositionRequirement, NewPositionRequirement } from '../position-requirement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPositionRequirement for edit and NewPositionRequirementFormGroupInput for create.
 */
type PositionRequirementFormGroupInput = IPositionRequirement | PartialWithRequiredKeyOf<NewPositionRequirement>;

type PositionRequirementFormDefaults = Pick<NewPositionRequirement, 'id'>;

type PositionRequirementFormGroupContent = {
  id: FormControl<IPositionRequirement['id'] | NewPositionRequirement['id']>;
  mandatoty: FormControl<IPositionRequirement['mandatoty']>;
  training: FormControl<IPositionRequirement['training']>;
  position: FormControl<IPositionRequirement['position']>;
};

export type PositionRequirementFormGroup = FormGroup<PositionRequirementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PositionRequirementFormService {
  createPositionRequirementFormGroup(positionRequirement: PositionRequirementFormGroupInput = { id: null }): PositionRequirementFormGroup {
    const positionRequirementRawValue = {
      ...this.getFormDefaults(),
      ...positionRequirement,
    };
    return new FormGroup<PositionRequirementFormGroupContent>({
      id: new FormControl(
        { value: positionRequirementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      mandatoty: new FormControl(positionRequirementRawValue.mandatoty),
      training: new FormControl(positionRequirementRawValue.training),
      position: new FormControl(positionRequirementRawValue.position),
    });
  }

  getPositionRequirement(form: PositionRequirementFormGroup): IPositionRequirement | NewPositionRequirement {
    return form.getRawValue() as IPositionRequirement | NewPositionRequirement;
  }

  resetForm(form: PositionRequirementFormGroup, positionRequirement: PositionRequirementFormGroupInput): void {
    const positionRequirementRawValue = { ...this.getFormDefaults(), ...positionRequirement };
    form.reset(
      {
        ...positionRequirementRawValue,
        id: { value: positionRequirementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PositionRequirementFormDefaults {
    return {
      id: null,
    };
  }
}
