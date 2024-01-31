import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IShiftType } from '../shift-type.model';
import { ShiftTypeService } from '../service/shift-type.service';

@Component({
  standalone: true,
  templateUrl: './shift-type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ShiftTypeDeleteDialogComponent {
  shiftType?: IShiftType;

  constructor(
    protected shiftTypeService: ShiftTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shiftTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
