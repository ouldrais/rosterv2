import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { RefRotationComponent } from './list/ref-rotation.component';
import { RefRotationDetailComponent } from './detail/ref-rotation-detail.component';
import { RefRotationUpdateComponent } from './update/ref-rotation-update.component';
import RefRotationResolve from './route/ref-rotation-routing-resolve.service';

const refRotationRoute: Routes = [
  {
    path: '',
    component: RefRotationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RefRotationDetailComponent,
    resolve: {
      refRotation: RefRotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RefRotationUpdateComponent,
    resolve: {
      refRotation: RefRotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RefRotationUpdateComponent,
    resolve: {
      refRotation: RefRotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default refRotationRoute;
