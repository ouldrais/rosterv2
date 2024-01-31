import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ShiftTemplateComponent } from './list/shift-template.component';
import { ShiftTemplateDetailComponent } from './detail/shift-template-detail.component';
import { ShiftTemplateUpdateComponent } from './update/shift-template-update.component';
import ShiftTemplateResolve from './route/shift-template-routing-resolve.service';

const shiftTemplateRoute: Routes = [
  {
    path: '',
    component: ShiftTemplateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShiftTemplateDetailComponent,
    resolve: {
      shiftTemplate: ShiftTemplateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShiftTemplateUpdateComponent,
    resolve: {
      shiftTemplate: ShiftTemplateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShiftTemplateUpdateComponent,
    resolve: {
      shiftTemplate: ShiftTemplateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default shiftTemplateRoute;
