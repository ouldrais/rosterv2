import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResourceComponent } from './list/resource.component';
import { ResourceDetailComponent } from './detail/resource-detail.component';
import { ResourceUpdateComponent } from './update/resource-update.component';
import ResourceResolve from './route/resource-routing-resolve.service';

const resourceRoute: Routes = [
  {
    path: '',
    component: ResourceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResourceDetailComponent,
    resolve: {
      resource: ResourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResourceUpdateComponent,
    resolve: {
      resource: ResourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResourceUpdateComponent,
    resolve: {
      resource: ResourceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourceRoute;
