import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IResourceRoles, NewResourceRoles } from '../resource-roles.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResourceRoles for edit and NewResourceRolesFormGroupInput for create.
 */
type ResourceRolesFormGroupInput = IResourceRoles | PartialWithRequiredKeyOf<NewResourceRoles>;

type ResourceRolesFormDefaults = Pick<NewResourceRoles, 'id'>;

type ResourceRolesFormGroupContent = {
  id: FormControl<IResourceRoles['id'] | NewResourceRoles['id']>;
  role: FormControl<IResourceRoles['role']>;
  resource: FormControl<IResourceRoles['resource']>;
};

export type ResourceRolesFormGroup = FormGroup<ResourceRolesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourceRolesFormService {
  createResourceRolesFormGroup(resourceRoles: ResourceRolesFormGroupInput = { id: null }): ResourceRolesFormGroup {
    const resourceRolesRawValue = {
      ...this.getFormDefaults(),
      ...resourceRoles,
    };
    return new FormGroup<ResourceRolesFormGroupContent>({
      id: new FormControl(
        { value: resourceRolesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      role: new FormControl(resourceRolesRawValue.role),
      resource: new FormControl(resourceRolesRawValue.resource),
    });
  }

  getResourceRoles(form: ResourceRolesFormGroup): IResourceRoles | NewResourceRoles {
    return form.getRawValue() as IResourceRoles | NewResourceRoles;
  }

  resetForm(form: ResourceRolesFormGroup, resourceRoles: ResourceRolesFormGroupInput): void {
    const resourceRolesRawValue = { ...this.getFormDefaults(), ...resourceRoles };
    form.reset(
      {
        ...resourceRolesRawValue,
        id: { value: resourceRolesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourceRolesFormDefaults {
    return {
      id: null,
    };
  }
}
