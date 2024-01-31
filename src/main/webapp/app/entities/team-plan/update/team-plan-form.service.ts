import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITeamPlan, NewTeamPlan } from '../team-plan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITeamPlan for edit and NewTeamPlanFormGroupInput for create.
 */
type TeamPlanFormGroupInput = ITeamPlan | PartialWithRequiredKeyOf<NewTeamPlan>;

type TeamPlanFormDefaults = Pick<NewTeamPlan, 'id'>;

type TeamPlanFormGroupContent = {
  id: FormControl<ITeamPlan['id'] | NewTeamPlan['id']>;
  team: FormControl<ITeamPlan['team']>;
  shift: FormControl<ITeamPlan['shift']>;
};

export type TeamPlanFormGroup = FormGroup<TeamPlanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TeamPlanFormService {
  createTeamPlanFormGroup(teamPlan: TeamPlanFormGroupInput = { id: null }): TeamPlanFormGroup {
    const teamPlanRawValue = {
      ...this.getFormDefaults(),
      ...teamPlan,
    };
    return new FormGroup<TeamPlanFormGroupContent>({
      id: new FormControl(
        { value: teamPlanRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      team: new FormControl(teamPlanRawValue.team),
      shift: new FormControl(teamPlanRawValue.shift),
    });
  }

  getTeamPlan(form: TeamPlanFormGroup): ITeamPlan | NewTeamPlan {
    return form.getRawValue() as ITeamPlan | NewTeamPlan;
  }

  resetForm(form: TeamPlanFormGroup, teamPlan: TeamPlanFormGroupInput): void {
    const teamPlanRawValue = { ...this.getFormDefaults(), ...teamPlan };
    form.reset(
      {
        ...teamPlanRawValue,
        id: { value: teamPlanRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TeamPlanFormDefaults {
    return {
      id: null,
    };
  }
}
