import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IShiftTemplate } from '../shift-template.model';
import { ShiftTemplateService } from '../service/shift-template.service';
import { ShiftTemplateFormService, ShiftTemplateFormGroup } from './shift-template-form.service';

@Component({
  standalone: true,
  selector: 'jhi-shift-template-update',
  templateUrl: './shift-template-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ShiftTemplateUpdateComponent implements OnInit {
  isSaving = false;
  shiftTemplate: IShiftTemplate | null = null;

  editForm: ShiftTemplateFormGroup = this.shiftTemplateFormService.createShiftTemplateFormGroup();

  constructor(
    protected shiftTemplateService: ShiftTemplateService,
    protected shiftTemplateFormService: ShiftTemplateFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shiftTemplate }) => {
      this.shiftTemplate = shiftTemplate;
      if (shiftTemplate) {
        this.updateForm(shiftTemplate);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shiftTemplate = this.shiftTemplateFormService.getShiftTemplate(this.editForm);
    if (shiftTemplate.id !== null) {
      this.subscribeToSaveResponse(this.shiftTemplateService.update(shiftTemplate));
    } else {
      this.subscribeToSaveResponse(this.shiftTemplateService.create(shiftTemplate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShiftTemplate>>): void {
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

  protected updateForm(shiftTemplate: IShiftTemplate): void {
    this.shiftTemplate = shiftTemplate;
    this.shiftTemplateFormService.resetForm(this.editForm, shiftTemplate);
  }
}
