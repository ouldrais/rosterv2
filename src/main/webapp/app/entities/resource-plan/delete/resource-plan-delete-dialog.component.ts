import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IResourcePlan } from '../resource-plan.model';
import { ResourcePlanService } from '../service/resource-plan.service';

@Component({
  standalone: true,
  templateUrl: './resource-plan-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ResourcePlanDeleteDialogComponent {
  resourcePlan?: IResourcePlan;

  constructor(
    protected resourcePlanService: ResourcePlanService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resourcePlanService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
