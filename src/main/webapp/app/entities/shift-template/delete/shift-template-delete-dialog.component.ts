import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IShiftTemplate } from '../shift-template.model';
import { ShiftTemplateService } from '../service/shift-template.service';

@Component({
  standalone: true,
  templateUrl: './shift-template-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ShiftTemplateDeleteDialogComponent {
  shiftTemplate?: IShiftTemplate;

  constructor(
    protected shiftTemplateService: ShiftTemplateService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shiftTemplateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
