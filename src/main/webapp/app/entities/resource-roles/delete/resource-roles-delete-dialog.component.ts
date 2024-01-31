import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IResourceRoles } from '../resource-roles.model';
import { ResourceRolesService } from '../service/resource-roles.service';

@Component({
  standalone: true,
  templateUrl: './resource-roles-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ResourceRolesDeleteDialogComponent {
  resourceRoles?: IResourceRoles;

  constructor(
    protected resourceRolesService: ResourceRolesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resourceRolesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
