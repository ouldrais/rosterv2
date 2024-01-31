import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IResourcePlan, NewResourcePlan } from '../resource-plan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResourcePlan for edit and NewResourcePlanFormGroupInput for create.
 */
type ResourcePlanFormGroupInput = IResourcePlan | PartialWithRequiredKeyOf<NewResourcePlan>;

type ResourcePlanFormDefaults = Pick<NewResourcePlan, 'id' | 'availability'>;

type ResourcePlanFormGroupContent = {
  id: FormControl<IResourcePlan['id'] | NewResourcePlan['id']>;
  availability: FormControl<IResourcePlan['availability']>;
  resource: FormControl<IResourcePlan['resource']>;
  shift: FormControl<IResourcePlan['shift']>;
  position: FormControl<IResourcePlan['position']>;
};

export type ResourcePlanFormGroup = FormGroup<ResourcePlanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourcePlanFormService {
  createResourcePlanFormGroup(resourcePlan: ResourcePlanFormGroupInput = { id: null }): ResourcePlanFormGroup {
    const resourcePlanRawValue = {
      ...this.getFormDefaults(),
      ...resourcePlan,
    };
    return new FormGroup<ResourcePlanFormGroupContent>({
      id: new FormControl(
        { value: resourcePlanRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      availability: new FormControl(resourcePlanRawValue.availability),
      resource: new FormControl(resourcePlanRawValue.resource),
      shift: new FormControl(resourcePlanRawValue.shift),
      position: new FormControl(resourcePlanRawValue.position),
    });
  }

  getResourcePlan(form: ResourcePlanFormGroup): IResourcePlan | NewResourcePlan {
    return form.getRawValue() as IResourcePlan | NewResourcePlan;
  }

  resetForm(form: ResourcePlanFormGroup, resourcePlan: ResourcePlanFormGroupInput): void {
    const resourcePlanRawValue = { ...this.getFormDefaults(), ...resourcePlan };
    form.reset(
      {
        ...resourcePlanRawValue,
        id: { value: resourcePlanRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourcePlanFormDefaults {
    return {
      id: null,
      availability: false,
    };
  }
}
