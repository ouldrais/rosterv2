import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ShiftComponent } from './list/shift.component';
import { ShiftDetailComponent } from './detail/shift-detail.component';
import { ShiftUpdateComponent } from './update/shift-update.component';
import ShiftResolve from './route/shift-routing-resolve.service';

const shiftRoute: Routes = [
  {
    path: '',
    component: ShiftComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShiftDetailComponent,
    resolve: {
      shift: ShiftResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShiftUpdateComponent,
    resolve: {
      shift: ShiftResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShiftUpdateComponent,
    resolve: {
      shift: ShiftResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default shiftRoute;
