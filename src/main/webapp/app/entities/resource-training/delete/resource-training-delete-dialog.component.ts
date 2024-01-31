import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IResourceTraining } from '../resource-training.model';
import { ResourceTrainingService } from '../service/resource-training.service';

@Component({
  standalone: true,
  templateUrl: './resource-training-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ResourceTrainingDeleteDialogComponent {
  resourceTraining?: IResourceTraining;

  constructor(
    protected resourceTrainingService: ResourceTrainingService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resourceTrainingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
