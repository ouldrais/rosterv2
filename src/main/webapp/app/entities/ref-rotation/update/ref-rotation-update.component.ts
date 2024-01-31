import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShiftType } from 'app/entities/shift-type/shift-type.model';
import { ShiftTypeService } from 'app/entities/shift-type/service/shift-type.service';
import { IRefRotation } from '../ref-rotation.model';
import { RefRotationService } from '../service/ref-rotation.service';
import { RefRotationFormService, RefRotationFormGroup } from './ref-rotation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ref-rotation-update',
  templateUrl: './ref-rotation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RefRotationUpdateComponent implements OnInit {
  isSaving = false;
  refRotation: IRefRotation | null = null;

  shiftTypesSharedCollection: IShiftType[] = [];

  editForm: RefRotationFormGroup = this.refRotationFormService.createRefRotationFormGroup();

  constructor(
    protected refRotationService: RefRotationService,
    protected refRotationFormService: RefRotationFormService,
    protected shiftTypeService: ShiftTypeService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareShiftType = (o1: IShiftType | null, o2: IShiftType | null): boolean => this.shiftTypeService.compareShiftType(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ refRotation }) => {
      this.refRotation = refRotation;
      if (refRotation) {
        this.updateForm(refRotation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const refRotation = this.refRotationFormService.getRefRotation(this.editForm);
    if (refRotation.id !== null) {
      this.subscribeToSaveResponse(this.refRotationService.update(refRotation));
    } else {
      this.subscribeToSaveResponse(this.refRotationService.create(refRotation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRefRotation>>): void {
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

  protected updateForm(refRotation: IRefRotation): void {
    this.refRotation = refRotation;
    this.refRotationFormService.resetForm(this.editForm, refRotation);

    this.shiftTypesSharedCollection = this.shiftTypeService.addShiftTypeToCollectionIfMissing<IShiftType>(
      this.shiftTypesSharedCollection,
      refRotation.shiftType,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shiftTypeService
      .query()
      .pipe(map((res: HttpResponse<IShiftType[]>) => res.body ?? []))
      .pipe(
        map((shiftTypes: IShiftType[]) =>
          this.shiftTypeService.addShiftTypeToCollectionIfMissing<IShiftType>(shiftTypes, this.refRotation?.shiftType),
        ),
      )
      .subscribe((shiftTypes: IShiftType[]) => (this.shiftTypesSharedCollection = shiftTypes));
  }
}
