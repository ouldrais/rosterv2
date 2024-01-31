import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TeamPlanComponent } from './list/team-plan.component';
import { TeamPlanDetailComponent } from './detail/team-plan-detail.component';
import { TeamPlanUpdateComponent } from './update/team-plan-update.component';
import TeamPlanResolve from './route/team-plan-routing-resolve.service';

const teamPlanRoute: Routes = [
  {
    path: '',
    component: TeamPlanComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamPlanDetailComponent,
    resolve: {
      teamPlan: TeamPlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamPlanUpdateComponent,
    resolve: {
      teamPlan: TeamPlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamPlanUpdateComponent,
    resolve: {
      teamPlan: TeamPlanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default teamPlanRoute;
