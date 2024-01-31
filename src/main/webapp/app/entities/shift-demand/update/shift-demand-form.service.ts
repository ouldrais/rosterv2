import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShiftDemand, NewShiftDemand } from '../shift-demand.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShiftDemand for edit and NewShiftDemandFormGroupInput for create.
 */
type ShiftDemandFormGroupInput = IShiftDemand | PartialWithRequiredKeyOf<NewShiftDemand>;

type ShiftDemandFormDefaults = Pick<NewShiftDemand, 'id'>;

type ShiftDemandFormGroupContent = {
  id: FormControl<IShiftDemand['id'] | NewShiftDemand['id']>;
  count: FormControl<IShiftDemand['count']>;
  shift: FormControl<IShiftDemand['shift']>;
  task: FormControl<IShiftDemand['task']>;
  position: FormControl<IShiftDemand['position']>;
  department: FormControl<IShiftDemand['department']>;
};

export type ShiftDemandFormGroup = FormGroup<ShiftDemandFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShiftDemandFormService {
  createShiftDemandFormGroup(shiftDemand: ShiftDemandFormGroupInput = { id: null }): ShiftDemandFormGroup {
    const shiftDemandRawValue = {
      ...this.getFormDefaults(),
      ...shiftDemand,
    };
    return new FormGroup<ShiftDemandFormGroupContent>({
      id: new FormControl(
        { value: shiftDemandRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      count: new FormControl(shiftDemandRawValue.count),
      shift: new FormControl(shiftDemandRawValue.shift),
      task: new FormControl(shiftDemandRawValue.task),
      position: new FormControl(shiftDemandRawValue.position),
      department: new FormControl(shiftDemandRawValue.department),
    });
  }

  getShiftDemand(form: ShiftDemandFormGroup): IShiftDemand | NewShiftDemand {
    return form.getRawValue() as IShiftDemand | NewShiftDemand;
  }

  resetForm(form: ShiftDemandFormGroup, shiftDemand: ShiftDemandFormGroupInput): void {
    const shiftDemandRawValue = { ...this.getFormDefaults(), ...shiftDemand };
    form.reset(
      {
        ...shiftDemandRawValue,
        id: { value: shiftDemandRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ShiftDemandFormDefaults {
    return {
      id: null,
    };
  }
}
