import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { ITraining } from 'app/entities/training/training.model';
import { TrainingService } from 'app/entities/training/service/training.service';
import { ResourceTrainingService } from '../service/resource-training.service';
import { IResourceTraining } from '../resource-training.model';
import { ResourceTrainingFormService, ResourceTrainingFormGroup } from './resource-training-form.service';

@Component({
  standalone: true,
  selector: 'jhi-resource-training-update',
  templateUrl: './resource-training-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ResourceTrainingUpdateComponent implements OnInit {
  isSaving = false;
  resourceTraining: IResourceTraining | null = null;

  resourcesSharedCollection: IResource[] = [];
  trainingsSharedCollection: ITraining[] = [];

  editForm: ResourceTrainingFormGroup = this.resourceTrainingFormService.createResourceTrainingFormGroup();

  constructor(
    protected resourceTrainingService: ResourceTrainingService,
    protected resourceTrainingFormService: ResourceTrainingFormService,
    protected resourceService: ResourceService,
    protected trainingService: TrainingService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareResource = (o1: IResource | null, o2: IResource | null): boolean => this.resourceService.compareResource(o1, o2);

  compareTraining = (o1: ITraining | null, o2: ITraining | null): boolean => this.trainingService.compareTraining(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resourceTraining }) => {
      this.resourceTraining = resourceTraining;
      if (resourceTraining) {
        this.updateForm(resourceTraining);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resourceTraining = this.resourceTrainingFormService.getResourceTraining(this.editForm);
    if (resourceTraining.id !== null) {
      this.subscribeToSaveResponse(this.resourceTrainingService.update(resourceTraining));
    } else {
      this.subscribeToSaveResponse(this.resourceTrainingService.create(resourceTraining));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResourceTraining>>): void {
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

  protected updateForm(resourceTraining: IResourceTraining): void {
    this.resourceTraining = resourceTraining;
    this.resourceTrainingFormService.resetForm(this.editForm, resourceTraining);

    this.resourcesSharedCollection = this.resourceService.addResourceToCollectionIfMissing<IResource>(
      this.resourcesSharedCollection,
      resourceTraining.resource,
    );
    this.trainingsSharedCollection = this.trainingService.addTrainingToCollectionIfMissing<ITraining>(
      this.trainingsSharedCollection,
      resourceTraining.training,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.resourceService
      .query()
      .pipe(map((res: HttpResponse<IResource[]>) => res.body ?? []))
      .pipe(
        map((resources: IResource[]) =>
          this.resourceService.addResourceToCollectionIfMissing<IResource>(resources, this.resourceTraining?.resource),
        ),
      )
      .subscribe((resources: IResource[]) => (this.resourcesSharedCollection = resources));

    this.trainingService
      .query()
      .pipe(map((res: HttpResponse<ITraining[]>) => res.body ?? []))
      .pipe(
        map((trainings: ITraining[]) =>
          this.trainingService.addTrainingToCollectionIfMissing<ITraining>(trainings, this.resourceTraining?.training),
        ),
      )
      .subscribe((trainings: ITraining[]) => (this.trainingsSharedCollection = trainings));
  }
}
