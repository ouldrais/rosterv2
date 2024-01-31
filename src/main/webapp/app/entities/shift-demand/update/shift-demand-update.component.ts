import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShift } from 'app/entities/shift/shift.model';
import { ShiftService } from 'app/entities/shift/service/shift.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { ShiftDemandService } from '../service/shift-demand.service';
import { IShiftDemand } from '../shift-demand.model';
import { ShiftDemandFormService, ShiftDemandFormGroup } from './shift-demand-form.service';

@Component({
  standalone: true,
  selector: 'jhi-shift-demand-update',
  templateUrl: './shift-demand-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ShiftDemandUpdateComponent implements OnInit {
  isSaving = false;
  shiftDemand: IShiftDemand | null = null;

  shiftsSharedCollection: IShift[] = [];
  tasksSharedCollection: ITask[] = [];
  positionsSharedCollection: IPosition[] = [];
  departmentsSharedCollection: IDepartment[] = [];

  editForm: ShiftDemandFormGroup = this.shiftDemandFormService.createShiftDemandFormGroup();

  constructor(
    protected shiftDemandService: ShiftDemandService,
    protected shiftDemandFormService: ShiftDemandFormService,
    protected shiftService: ShiftService,
    protected taskService: TaskService,
    protected positionService: PositionService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareShift = (o1: IShift | null, o2: IShift | null): boolean => this.shiftService.compareShift(o1, o2);

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  comparePosition = (o1: IPosition | null, o2: IPosition | null): boolean => this.positionService.comparePosition(o1, o2);

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shiftDemand }) => {
      this.shiftDemand = shiftDemand;
      if (shiftDemand) {
        this.updateForm(shiftDemand);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shiftDemand = this.shiftDemandFormService.getShiftDemand(this.editForm);
    if (shiftDemand.id !== null) {
      this.subscribeToSaveResponse(this.shiftDemandService.update(shiftDemand));
    } else {
      this.subscribeToSaveResponse(this.shiftDemandService.create(shiftDemand));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShiftDemand>>): void {
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

  protected updateForm(shiftDemand: IShiftDemand): void {
    this.shiftDemand = shiftDemand;
    this.shiftDemandFormService.resetForm(this.editForm, shiftDemand);

    this.shiftsSharedCollection = this.shiftService.addShiftToCollectionIfMissing<IShift>(this.shiftsSharedCollection, shiftDemand.shift);
    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, shiftDemand.task);
    this.positionsSharedCollection = this.positionService.addPositionToCollectionIfMissing<IPosition>(
      this.positionsSharedCollection,
      shiftDemand.position,
    );
    this.departmentsSharedCollection = this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
      this.departmentsSharedCollection,
      shiftDemand.department,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shiftService
      .query()
      .pipe(map((res: HttpResponse<IShift[]>) => res.body ?? []))
      .pipe(map((shifts: IShift[]) => this.shiftService.addShiftToCollectionIfMissing<IShift>(shifts, this.shiftDemand?.shift)))
      .subscribe((shifts: IShift[]) => (this.shiftsSharedCollection = shifts));

    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.shiftDemand?.task)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.positionService
      .query()
      .pipe(map((res: HttpResponse<IPosition[]>) => res.body ?? []))
      .pipe(
        map((positions: IPosition[]) =>
          this.positionService.addPositionToCollectionIfMissing<IPosition>(positions, this.shiftDemand?.position),
        ),
      )
      .subscribe((positions: IPosition[]) => (this.positionsSharedCollection = positions));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.shiftDemand?.department),
        ),
      )
      .subscribe((departments: IDepartment[]) => (this.departmentsSharedCollection = departments));
  }
}
