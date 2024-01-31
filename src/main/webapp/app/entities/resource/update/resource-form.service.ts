import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IResource, NewResource } from '../resource.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResource for edit and NewResourceFormGroupInput for create.
 */
type ResourceFormGroupInput = IResource | PartialWithRequiredKeyOf<NewResource>;

type ResourceFormDefaults = Pick<NewResource, 'id' | 'exchangeAllowed'>;

type ResourceFormGroupContent = {
  id: FormControl<IResource['id'] | NewResource['id']>;
  key: FormControl<IResource['key']>;
  firstName: FormControl<IResource['firstName']>;
  lastName: FormControl<IResource['lastName']>;
  teamRole: FormControl<IResource['teamRole']>;
  exchangeAllowed: FormControl<IResource['exchangeAllowed']>;
  team: FormControl<IResource['team']>;
};

export type ResourceFormGroup = FormGroup<ResourceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourceFormService {
  createResourceFormGroup(resource: ResourceFormGroupInput = { id: null }): ResourceFormGroup {
    const resourceRawValue = {
      ...this.getFormDefaults(),
      ...resource,
    };
    return new FormGroup<ResourceFormGroupContent>({
      id: new FormControl(
        { value: resourceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      key: new FormControl(resourceRawValue.key),
      firstName: new FormControl(resourceRawValue.firstName),
      lastName: new FormControl(resourceRawValue.lastName),
      teamRole: new FormControl(resourceRawValue.teamRole),
      exchangeAllowed: new FormControl(resourceRawValue.exchangeAllowed),
      team: new FormControl(resourceRawValue.team),
    });
  }

  getResource(form: ResourceFormGroup): IResource | NewResource {
    return form.getRawValue() as IResource | NewResource;
  }

  resetForm(form: ResourceFormGroup, resource: ResourceFormGroupInput): void {
    const resourceRawValue = { ...this.getFormDefaults(), ...resource };
    form.reset(
      {
        ...resourceRawValue,
        id: { value: resourceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourceFormDefaults {
    return {
      id: null,
      exchangeAllowed: false,
    };
  }
}
