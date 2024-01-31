import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITeamPlan } from '../team-plan.model';
import { TeamPlanService } from '../service/team-plan.service';

@Component({
  standalone: true,
  templateUrl: './team-plan-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TeamPlanDeleteDialogComponent {
  teamPlan?: ITeamPlan;

  constructor(
    protected teamPlanService: TeamPlanService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamPlanService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
