import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { ResourcePlanService } from '../service/resource-plan.service';
import { IResourcePlan } from '../resource-plan.model';
import { ResourcePlanFormService, ResourcePlanFormGroup } from './resource-plan-form.service';

@Component({
  standalone: true,
  selector: 'jhi-resource-plan-update',
  templateUrl: './resource-plan-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ResourcePlanUpdateComponent implements OnInit {
  isSaving = false;
  resourcePlan: IResourcePlan | null = null;

  resourcesSharedCollection: IResource[] = [];
  shiftsSharedCollection: IShift[] = [];
  positionsSharedCollection: IPosition[] = [];

  editForm: ResourcePlanFormGroup = this.resourcePlanFormService.createResourcePlanFormGroup();

  constructor(
    protected resourcePlanService: ResourcePlanService,
    protected resourcePlanFormService: ResourcePlanFormService,
    protected resourceService: ResourceService,
    protected shiftService: ShiftService,
    protected positionService: PositionService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareResource = (o1: IResource | null, o2: IResource | null): boolean => this.resourceService.compareResource(o1, o2);

  compareShift = (o1: IShift | null, o2: IShift | null): boolean => this.shiftService.compareShift(o1, o2);

  comparePosition = (o1: IPosition | null, o2: IPosition | null): boolean => this.positionService.comparePosition(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resourcePlan }) => {
      this.resourcePlan = resourcePlan;
      if (resourcePlan) {
        this.updateForm(resourcePlan);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resourcePlan = this.resourcePlanFormService.getResourcePlan(this.editForm);
    if (resourcePlan.id !== null) {
      this.subscribeToSaveResponse(this.resourcePlanService.update(resourcePlan));
    } else {
      this.subscribeToSaveResponse(this.resourcePlanService.create(resourcePlan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResourcePlan>>): void {
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

  protected updateForm(resourcePlan: IResourcePlan): void {
    this.resourcePlan = resourcePlan;
    this.resourcePlanFormService.resetForm(this.editForm, resourcePlan);

    this.resourcesSharedCollection = this.resourceService.addResourceToCollectionIfMissing<IResource>(
      this.resourcesSharedCollection,
      resourcePlan.resource,
    );
    this.shiftsSharedCollection = this.shiftService.addShiftToCollectionIfMissing<IShift>(this.shiftsSharedCollection, resourcePlan.shift);
    this.positionsSharedCollection = this.positionService.addPositionToCollectionIfMissing<IPosition>(
      this.positionsSharedCollection,
      resourcePlan.position,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.resourceService
      .query()
      .pipe(map((res: HttpResponse<IResource[]>) => res.body ?? []))
      .pipe(
        map((resources: IResource[]) =>
          this.resourceService.addResourceToCollectionIfMissing<IResource>(resources, this.resourcePlan?.resource),
        ),
      )
      .subscribe((resources: IResource[]) => (this.resourcesSharedCollection = resources));

    this.shiftService
      .query()
      .pipe(map((res: HttpResponse<IShift[]>) => res.body ?? []))
      .pipe(map((shifts: IShift[]) => this.shiftService.addShiftToCollectionIfMissing<IShift>(shifts, this.resourcePlan?.shift)))
      .subscribe((shifts: IShift[]) => (this.shiftsSharedCollection = shifts));

    this.positionService
      .query()
      .pipe(map((res: HttpResponse<IPosition[]>) => res.body ?? []))
      .pipe(
        map((positions: IPosition[]) =>
          this.positionService.addPositionToCollectionIfMissing<IPosition>(positions, this.resourcePlan?.position),
        ),
      )
      .subscribe((positions: IPosition[]) => (this.positionsSharedCollection = positions));
  }
}
