import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFacility } from '../facility.model';
import { FacilityService } from '../service/facility.service';
import { FacilityFormService, FacilityFormGroup } from './facility-form.service';

@Component({
  standalone: true,
  selector: 'jhi-facility-update',
  templateUrl: './facility-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FacilityUpdateComponent implements OnInit {
  isSaving = false;
  facility: IFacility | null = null;

  editForm: FacilityFormGroup = this.facilityFormService.createFacilityFormGroup();

  constructor(
    protected facilityService: FacilityService,
    protected facilityFormService: FacilityFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facility }) => {
      this.facility = facility;
      if (facility) {
        this.updateForm(facility);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facility = this.facilityFormService.getFacility(this.editForm);
    if (facility.id !== null) {
      this.subscribeToSaveResponse(this.facilityService.update(facility));
    } else {
      this.subscribeToSaveResponse(this.facilityService.create(facility));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFacility>>): void {
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

  protected updateForm(facility: IFacility): void {
    this.facility = facility;
    this.facilityFormService.resetForm(this.editForm, facility);
  }
}
