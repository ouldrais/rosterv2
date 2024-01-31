import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShift } from '../shift.model';
import { ShiftService } from '../service/shift.service';
import { ShiftFormService, ShiftFormGroup } from './shift-form.service';

@Component({
  standalone: true,
  selector: 'jhi-shift-update',
  templateUrl: './shift-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ShiftUpdateComponent implements OnInit {
  isSaving = false;
  shift: IShift | null = null;

  editForm: ShiftFormGroup = this.shiftFormService.createShiftFormGroup();

  constructor(
    protected shiftService: ShiftService,
    protected shiftFormService: ShiftFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shift }) => {
      this.shift = shift;
      if (shift) {
        this.updateForm(shift);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shift = this.shiftFormService.getShift(this.editForm);
    if (shift.id !== null) {
      this.subscribeToSaveResponse(this.shiftService.update(shift));
    } else {
      this.subscribeToSaveResponse(this.shiftService.create(shift));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShift>>): void {
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

  protected updateForm(shift: IShift): void {
    this.shift = shift;
    this.shiftFormService.resetForm(this.editForm, shift);
  }
}
