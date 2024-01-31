import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IShift } from '../shift.model';
import { ShiftService } from '../service/shift.service';

@Component({
  standalone: true,
  templateUrl: './shift-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ShiftDeleteDialogComponent {
  shift?: IShift;

  constructor(
    protected shiftService: ShiftService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shiftService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
