import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITraining } from 'app/entities/training/training.model';
import { TrainingService } from 'app/entities/training/service/training.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { PositionRequirementService } from '../service/position-requirement.service';
import { IPositionRequirement } from '../position-requirement.model';
import { PositionRequirementFormService, PositionRequirementFormGroup } from './position-requirement-form.service';

@Component({
  standalone: true,
  selector: 'jhi-position-requirement-update',
  templateUrl: './position-requirement-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PositionRequirementUpdateComponent implements OnInit {
  isSaving = false;
  positionRequirement: IPositionRequirement | null = null;

  trainingsSharedCollection: ITraining[] = [];
  positionsSharedCollection: IPosition[] = [];

  editForm: PositionRequirementFormGroup = this.positionRequirementFormService.createPositionRequirementFormGroup();

  constructor(
    protected positionRequirementService: PositionRequirementService,
    protected positionRequirementFormService: PositionRequirementFormService,
    protected trainingService: TrainingService,
    protected positionService: PositionService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareTraining = (o1: ITraining | null, o2: ITraining | null): boolean => this.trainingService.compareTraining(o1, o2);

  comparePosition = (o1: IPosition | null, o2: IPosition | null): boolean => this.positionService.comparePosition(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positionRequirement }) => {
      this.positionRequirement = positionRequirement;
      if (positionRequirement) {
        this.updateForm(positionRequirement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const positionRequirement = this.positionRequirementFormService.getPositionRequirement(this.editForm);
    if (positionRequirement.id !== null) {
      this.subscribeToSaveResponse(this.positionRequirementService.update(positionRequirement));
    } else {
      this.subscribeToSaveResponse(this.positionRequirementService.create(positionRequirement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPositionRequirement>>): void {
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

  protected updateForm(positionRequirement: IPositionRequirement): void {
    this.positionRequirement = positionRequirement;
    this.positionRequirementFormService.resetForm(this.editForm, positionRequirement);

    this.trainingsSharedCollection = this.trainingService.addTrainingToCollectionIfMissing<ITraining>(
      this.trainingsSharedCollection,
      positionRequirement.training,
    );
    this.positionsSharedCollection = this.positionService.addPositionToCollectionIfMissing<IPosition>(
      this.positionsSharedCollection,
      positionRequirement.position,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.trainingService
      .query()
      .pipe(map((res: HttpResponse<ITraining[]>) => res.body ?? []))
      .pipe(
        map((trainings: ITraining[]) =>
          this.trainingService.addTrainingToCollectionIfMissing<ITraining>(trainings, this.positionRequirement?.training),
        ),
      )
      .subscribe((trainings: ITraining[]) => (this.trainingsSharedCollection = trainings));

    this.positionService
      .query()
      .pipe(map((res: HttpResponse<IPosition[]>) => res.body ?? []))
      .pipe(
        map((positions: IPosition[]) =>
          this.positionService.addPositionToCollectionIfMissing<IPosition>(positions, this.positionRequirement?.position),
        ),
      )
      .subscribe((positions: IPosition[]) => (this.positionsSharedCollection = positions));
  }
}
