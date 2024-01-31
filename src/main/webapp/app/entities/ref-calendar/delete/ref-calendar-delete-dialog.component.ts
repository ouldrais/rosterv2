import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRefCalendar } from '../ref-calendar.model';
import { RefCalendarService } from '../service/ref-calendar.service';

@Component({
  standalone: true,
  templateUrl: './ref-calendar-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RefCalendarDeleteDialogComponent {
  refCalendar?: IRefCalendar;

  constructor(
    protected refCalendarService: RefCalendarService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.refCalendarService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
