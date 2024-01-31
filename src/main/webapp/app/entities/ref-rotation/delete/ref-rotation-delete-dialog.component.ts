import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRefRotation } from '../ref-rotation.model';
import { RefRotationService } from '../service/ref-rotation.service';

@Component({
  standalone: true,
  templateUrl: './ref-rotation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RefRotationDeleteDialogComponent {
  refRotation?: IRefRotation;

  constructor(
    protected refRotationService: RefRotationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.refRotationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
