import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { TeamPlanService } from '../service/team-plan.service';
import { ITeamPlan } from '../team-plan.model';
import { TeamPlanFormService, TeamPlanFormGroup } from './team-plan-form.service';

@Component({
  standalone: true,
  selector: 'jhi-team-plan-update',
  templateUrl: './team-plan-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TeamPlanUpdateComponent implements OnInit {
  isSaving = false;
  teamPlan: ITeamPlan | null = null;

  teamsSharedCollection: ITeam[] = [];
  shiftsSharedCollection: IShift[] = [];

  editForm: TeamPlanFormGroup = this.teamPlanFormService.createTeamPlanFormGroup();

  constructor(
    protected teamPlanService: TeamPlanService,
    protected teamPlanFormService: TeamPlanFormService,
    protected teamService: TeamService,
    protected shiftService: ShiftService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  compareShift = (o1: IShift | null, o2: IShift | null): boolean => this.shiftService.compareShift(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teamPlan }) => {
      this.teamPlan = teamPlan;
      if (teamPlan) {
        this.updateForm(teamPlan);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const teamPlan = this.teamPlanFormService.getTeamPlan(this.editForm);
    if (teamPlan.id !== null) {
      this.subscribeToSaveResponse(this.teamPlanService.update(teamPlan));
    } else {
      this.subscribeToSaveResponse(this.teamPlanService.create(teamPlan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeamPlan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(teamPlan: ITeamPlan): void {
    this.teamPlan = teamPlan;
    this.teamPlanFormService.resetForm(this.editForm, teamPlan);

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, teamPlan.team);
    this.shiftsSharedCollection = this.shiftService.addShiftToCollectionIfMissing<IShift>(this.shiftsSharedCollection, teamPlan.shift);
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.teamPlan?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));

    this.shiftService
      .query()
      .pipe(map((res: HttpResponse<IShift[]>) => res.body ?? []))
      .pipe(map((shifts: IShift[]) => this.shiftService.addShiftToCollectionIfMissing<IShift>(shifts, this.teamPlan?.shift)))
      .subscribe((shifts: IShift[]) => (this.shiftsSharedCollection = shifts));
  }
}
