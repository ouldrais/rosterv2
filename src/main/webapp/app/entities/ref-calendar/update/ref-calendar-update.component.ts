import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShiftType } from 'app/entities/shift-type/shift-type.model';
import { ShiftTypeService } from 'app/entities/shift-type/service/shift-type.service';
import { IRefCalendar } from '../ref-calendar.model';
import { RefCalendarService } from '../service/ref-calendar.service';
import { RefCalendarFormService, RefCalendarFormGroup } from './ref-calendar-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ref-calendar-update',
  templateUrl: './ref-calendar-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RefCalendarUpdateComponent implements OnInit {
  isSaving = false;
  refCalendar: IRefCalendar | null = null;

  shiftTypesSharedCollection: IShiftType[] = [];

  editForm: RefCalendarFormGroup = this.refCalendarFormService.createRefCalendarFormGroup();

  constructor(
    protected refCalendarService: RefCalendarService,
    protected refCalendarFormService: RefCalendarFormService,
    protected shiftTypeService: ShiftTypeService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareShiftType = (o1: IShiftType | null, o2: IShiftType | null): boolean => this.shiftTypeService.compareShiftType(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ refCalendar }) => {
      this.refCalendar = refCalendar;
      if (refCalendar) {
        this.updateForm(refCalendar);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const refCalendar = this.refCalendarFormService.getRefCalendar(this.editForm);
    if (refCalendar.id !== null) {
      this.subscribeToSaveResponse(this.refCalendarService.update(refCalendar));
    } else {
      this.subscribeToSaveResponse(this.refCalendarService.create(refCalendar));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRefCalendar>>): void {
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

  protected updateForm(refCalendar: IRefCalendar): void {
    this.refCalendar = refCalendar;
    this.refCalendarFormService.resetForm(this.editForm, refCalendar);

    this.shiftTypesSharedCollection = this.shiftTypeService.addShiftTypeToCollectionIfMissing<IShiftType>(
      this.shiftTypesSharedCollection,
      refCalendar.shiftType,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shiftTypeService
      .query()
      .pipe(map((res: HttpResponse<IShiftType[]>) => res.body ?? []))
      .pipe(
        map((shiftTypes: IShiftType[]) =>
          this.shiftTypeService.addShiftTypeToCollectionIfMissing<IShiftType>(shiftTypes, this.refCalendar?.shiftType),
        ),
      )
      .subscribe((shiftTypes: IShiftType[]) => (this.shiftTypesSharedCollection = shiftTypes));
  }
}
