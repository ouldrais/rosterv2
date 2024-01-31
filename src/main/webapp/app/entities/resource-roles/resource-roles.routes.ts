import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResourceRolesComponent } from './list/resource-roles.component';
import { ResourceRolesDetailComponent } from './detail/resource-roles-detail.component';
import { ResourceRolesUpdateComponent } from './update/resource-roles-update.component';
import ResourceRolesResolve from './route/resource-roles-routing-resolve.service';

const resourceRolesRoute: Routes = [
  {
    path: '',
    component: ResourceRolesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResourceRolesDetailComponent,
    resolve: {
      resourceRoles: ResourceRolesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResourceRolesUpdateComponent,
    resolve: {
      resourceRoles: ResourceRolesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResourceRolesUpdateComponent,
    resolve: {
      resourceRoles: ResourceRolesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourceRolesRoute;
