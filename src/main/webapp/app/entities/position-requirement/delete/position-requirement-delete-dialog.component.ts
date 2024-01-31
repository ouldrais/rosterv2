import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPositionRequirement } from '../position-requirement.model';
import { PositionRequirementService } from '../service/position-requirement.service';

@Component({
  standalone: true,
  templateUrl: './position-requirement-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PositionRequirementDeleteDialogComponent {
  positionRequirement?: IPositionRequirement;

  constructor(
    protected positionRequirementService: PositionRequirementService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.positionRequirementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
