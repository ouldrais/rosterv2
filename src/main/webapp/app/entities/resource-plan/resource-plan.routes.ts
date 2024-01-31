import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResourcePlanComponent } from './list/resource-plan.component';
import { ResourcePlanDetailComponent } from './detail/resource-plan-detail.component';
import { ResourcePlanUpdateComponent } from './update/resource-plan-update.component';
import ResourcePlanResolve from './route/resource-plan-routing-resolve.service';

const resourcePlanRoute: Routes = [
  {
    path: '',
    component: ResourcePlanComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResourcePlanDetailComponent,
    resolve: {
      resourcePlan: ResourcePlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResourcePlanUpdateComponent,
    resolve: {
      resourcePlan: ResourcePlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResourcePlanUpdateComponent,
    resolve: {
      resourcePlan: ResourcePlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourcePlanRoute;
