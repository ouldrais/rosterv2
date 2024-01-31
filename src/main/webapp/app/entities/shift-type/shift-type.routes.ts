import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ShiftTypeComponent } from './list/shift-type.component';
import { ShiftTypeDetailComponent } from './detail/shift-type-detail.component';
import { ShiftTypeUpdateComponent } from './update/shift-type-update.component';
import ShiftTypeResolve from './route/shift-type-routing-resolve.service';

const shiftTypeRoute: Routes = [
  {
    path: '',
    component: ShiftTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShiftTypeDetailComponent,
    resolve: {
      shiftType: ShiftTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShiftTypeUpdateComponent,
    resolve: {
      shiftType: ShiftTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShiftTypeUpdateComponent,
    resolve: {
      shiftType: ShiftTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default shiftTypeRoute;
