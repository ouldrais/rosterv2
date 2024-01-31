import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PositionRequirementComponent } from './list/position-requirement.component';
import { PositionRequirementDetailComponent } from './detail/position-requirement-detail.component';
import { PositionRequirementUpdateComponent } from './update/position-requirement-update.component';
import PositionRequirementResolve from './route/position-requirement-routing-resolve.service';

const positionRequirementRoute: Routes = [
  {
    path: '',
    component: PositionRequirementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionRequirementDetailComponent,
    resolve: {
      positionRequirement: PositionRequirementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionRequirementUpdateComponent,
    resolve: {
      positionRequirement: PositionRequirementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionRequirementUpdateComponent,
    resolve: {
      positionRequirement: PositionRequirementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default positionRequirementRoute;
