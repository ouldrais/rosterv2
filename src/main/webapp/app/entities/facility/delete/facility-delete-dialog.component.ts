import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFacility } from '../facility.model';
import { FacilityService } from '../service/facility.service';

@Component({
  standalone: true,
  templateUrl: './facility-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FacilityDeleteDialogComponent {
  facility?: IFacility;

  constructor(
    protected facilityService: FacilityService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.facilityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
