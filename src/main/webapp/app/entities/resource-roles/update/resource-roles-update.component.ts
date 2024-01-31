import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IResource } from 'app/entities/resource/resource.model';
import { ResourceService } from 'app/entities/resource/service/resource.service';
import { ResourceRolesService } from '../service/resource-roles.service';
import { IResourceRoles } from '../resource-roles.model';
import { ResourceRolesFormService, ResourceRolesFormGroup } from './resource-roles-form.service';

@Component({
  standalone: true,
  selector: 'jhi-resource-roles-update',
  templateUrl: './resource-roles-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ResourceRolesUpdateComponent implements OnInit {
  isSaving = false;
  resourceRoles: IResourceRoles | null = null;

  rolesSharedCollection: IRole[] = [];
  resourcesSharedCollection: IResource[] = [];

  editForm: ResourceRolesFormGroup = this.resourceRolesFormService.createResourceRolesFormGroup();

  constructor(
    protected resourceRolesService: ResourceRolesService,
    protected resourceRolesFormService: ResourceRolesFormService,
    protected roleService: RoleService,
    protected resourceService: ResourceService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareRole = (o1: IRole | null, o2: IRole | null): boolean => this.roleService.compareRole(o1, o2);

  compareResource = (o1: IResource | null, o2: IResource | null): boolean => this.resourceService.compareResource(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resourceRoles }) => {
      this.resourceRoles = resourceRoles;
      if (resourceRoles) {
        this.updateForm(resourceRoles);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resourceRoles = this.resourceRolesFormService.getResourceRoles(this.editForm);
    if (resourceRoles.id !== null) {
      this.subscribeToSaveResponse(this.resourceRolesService.update(resourceRoles));
    } else {
      this.subscribeToSaveResponse(this.resourceRolesService.create(resourceRoles));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResourceRoles>>): void {
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

  protected updateForm(resourceRoles: IResourceRoles): void {
    this.resourceRoles = resourceRoles;
    this.resourceRolesFormService.resetForm(this.editForm, resourceRoles);

    this.rolesSharedCollection = this.roleService.addRoleToCollectionIfMissing<IRole>(this.rolesSharedCollection, resourceRoles.role);
    this.resourcesSharedCollection = this.resourceService.addResourceToCollectionIfMissing<IResource>(
      this.resourcesSharedCollection,
      resourceRoles.resource,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.roleService
      .query()
      .pipe(map((res: HttpResponse<IRole[]>) => res.body ?? []))
      .pipe(map((roles: IRole[]) => this.roleService.addRoleToCollectionIfMissing<IRole>(roles, this.resourceRoles?.role)))
      .subscribe((roles: IRole[]) => (this.rolesSharedCollection = roles));

    this.resourceService
      .query()
      .pipe(map((res: HttpResponse<IResource[]>) => res.body ?? []))
      .pipe(
        map((resources: IResource[]) =>
          this.resourceService.addResourceToCollectionIfMissing<IResource>(resources, this.resourceRoles?.resource),
        ),
      )
      .subscribe((resources: IResource[]) => (this.resourcesSharedCollection = resources));
  }
}
