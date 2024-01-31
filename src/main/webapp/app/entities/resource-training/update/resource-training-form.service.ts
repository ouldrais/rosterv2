import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IResourceTraining, NewResourceTraining } from '../resource-training.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResourceTraining for edit and NewResourceTrainingFormGroupInput for create.
 */
type ResourceTrainingFormGroupInput = IResourceTraining | PartialWithRequiredKeyOf<NewResourceTraining>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IResourceTraining | NewResourceTraining> = Omit<T, 'activeFrom' | 'activeto'> & {
  activeFrom?: string | null;
  activeto?: string | null;
};

type ResourceTrainingFormRawValue = FormValueOf<IResourceTraining>;

type NewResourceTrainingFormRawValue = FormValueOf<NewResourceTraining>;

type ResourceTrainingFormDefaults = Pick<NewResourceTraining, 'id' | 'activeFrom' | 'activeto'>;

type ResourceTrainingFormGroupContent = {
  id: FormControl<ResourceTrainingFormRawValue['id'] | NewResourceTraining['id']>;
  status: FormControl<ResourceTrainingFormRawValue['status']>;
  level: FormControl<ResourceTrainingFormRawValue['level']>;
  trainer: FormControl<ResourceTrainingFormRawValue['trainer']>;
  activeFrom: FormControl<ResourceTrainingFormRawValue['activeFrom']>;
  activeto: FormControl<ResourceTrainingFormRawValue['activeto']>;
  resource: FormControl<ResourceTrainingFormRawValue['resource']>;
  training: FormControl<ResourceTrainingFormRawValue['training']>;
};

export type ResourceTrainingFormGroup = FormGroup<ResourceTrainingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResourceTrainingFormService {
  createResourceTrainingFormGroup(resourceTraining: ResourceTrainingFormGroupInput = { id: null }): ResourceTrainingFormGroup {
    const resourceTrainingRawValue = this.convertResourceTrainingToResourceTrainingRawValue({
      ...this.getFormDefaults(),
      ...resourceTraining,
    });
    return new FormGroup<ResourceTrainingFormGroupContent>({
      id: new FormControl(
        { value: resourceTrainingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      status: new FormControl(resourceTrainingRawValue.status),
      level: new FormControl(resourceTrainingRawValue.level),
      trainer: new FormControl(resourceTrainingRawValue.trainer),
      activeFrom: new FormControl(resourceTrainingRawValue.activeFrom),
      activeto: new FormControl(resourceTrainingRawValue.activeto),
      resource: new FormControl(resourceTrainingRawValue.resource),
      training: new FormControl(resourceTrainingRawValue.training),
    });
  }

  getResourceTraining(form: ResourceTrainingFormGroup): IResourceTraining | NewResourceTraining {
    return this.convertResourceTrainingRawValueToResourceTraining(
      form.getRawValue() as ResourceTrainingFormRawValue | NewResourceTrainingFormRawValue,
    );
  }

  resetForm(form: ResourceTrainingFormGroup, resourceTraining: ResourceTrainingFormGroupInput): void {
    const resourceTrainingRawValue = this.convertResourceTrainingToResourceTrainingRawValue({
      ...this.getFormDefaults(),
      ...resourceTraining,
    });
    form.reset(
      {
        ...resourceTrainingRawValue,
        id: { value: resourceTrainingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ResourceTrainingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      activeFrom: currentTime,
      activeto: currentTime,
    };
  }

  private convertResourceTrainingRawValueToResourceTraining(
    rawResourceTraining: ResourceTrainingFormRawValue | NewResourceTrainingFormRawValue,
  ): IResourceTraining | NewResourceTraining {
    return {
      ...rawResourceTraining,
      activeFrom: dayjs(rawResourceTraining.activeFrom, DATE_TIME_FORMAT),
      activeto: dayjs(rawResourceTraining.activeto, DATE_TIME_FORMAT),
    };
  }

  private convertResourceTrainingToResourceTrainingRawValue(
    resourceTraining: IResourceTraining | (Partial<NewResourceTraining> & ResourceTrainingFormDefaults),
  ): ResourceTrainingFormRawValue | PartialWithRequiredKeyOf<NewResourceTrainingFormRawValue> {
    return {
      ...resourceTraining,
      activeFrom: resourceTraining.activeFrom ? resourceTraining.activeFrom.format(DATE_TIME_FORMAT) : undefined,
      activeto: resourceTraining.activeto ? resourceTraining.activeto.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
