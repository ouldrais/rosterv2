import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShiftType } from '../shift-type.model';
import { ShiftTypeService } from '../service/shift-type.service';
import { ShiftTypeFormService, ShiftTypeFormGroup } from './shift-type-form.service';

@Component({
  standalone: true,
  selector: 'jhi-shift-type-update',
  templateUrl: './shift-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ShiftTypeUpdateComponent implements OnInit {
  isSaving = false;
  shiftType: IShiftType | null = null;

  editForm: ShiftTypeFormGroup = this.shiftTypeFormService.createShiftTypeFormGroup();

  constructor(
    protected shiftTypeService: ShiftTypeService,
    protected shiftTypeFormService: ShiftTypeFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shiftType }) => {
      this.shiftType = shiftType;
      if (shiftType) {
        this.updateForm(shiftType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shiftType = this.shiftTypeFormService.getShiftType(this.editForm);
    if (shiftType.id !== null) {
      this.subscribeToSaveResponse(this.shiftTypeService.update(shiftType));
    } else {
      this.subscribeToSaveResponse(this.shiftTypeService.create(shiftType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShiftType>>): void {
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

  protected updateForm(shiftType: IShiftType): void {
    this.shiftType = shiftType;
    this.shiftTypeFormService.resetForm(this.editForm, shiftType);
  }
}
