import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResourceTrainingComponent } from './list/resource-training.component';
import { ResourceTrainingDetailComponent } from './detail/resource-training-detail.component';
import { ResourceTrainingUpdateComponent } from './update/resource-training-update.component';
import ResourceTrainingResolve from './route/resource-training-routing-resolve.service';

const resourceTrainingRoute: Routes = [
  {
    path: '',
    component: ResourceTrainingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResourceTrainingDetailComponent,
    resolve: {
      resourceTraining: ResourceTrainingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResourceTrainingUpdateComponent,
    resolve: {
      resourceTraining: ResourceTrainingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResourceTrainingUpdateComponent,
    resolve: {
      resourceTraining: ResourceTrainingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourceTrainingRoute;
