import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ShiftDemandComponent } from './list/shift-demand.component';
import { ShiftDemandDetailComponent } from './detail/shift-demand-detail.component';
import { ShiftDemandUpdateComponent } from './update/shift-demand-update.component';
import ShiftDemandResolve from './route/shift-demand-routing-resolve.service';

const shiftDemandRoute: Routes = [
  {
    path: '',
    component: ShiftDemandComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShiftDemandDetailComponent,
    resolve: {
      shiftDemand: ShiftDemandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShiftDemandUpdateComponent,
    resolve: {
      shiftDemand: ShiftDemandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShiftDemandUpdateComponent,
    resolve: {
      shiftDemand: ShiftDemandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default shiftDemandRoute;
