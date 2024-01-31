import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IShiftDemand } from '../shift-demand.model';
import { ShiftDemandService } from '../service/shift-demand.service';

@Component({
  standalone: true,
  templateUrl: './shift-demand-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ShiftDemandDeleteDialogComponent {
  shiftDemand?: IShiftDemand;

  constructor(
    protected shiftDemandService: ShiftDemandService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shiftDemandService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
