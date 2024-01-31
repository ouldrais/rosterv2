import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { FacilityComponent } from './list/facility.component';
import { FacilityDetailComponent } from './detail/facility-detail.component';
import { FacilityUpdateComponent } from './update/facility-update.component';
import FacilityResolve from './route/facility-routing-resolve.service';

const facilityRoute: Routes = [
  {
    path: '',
    component: FacilityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacilityDetailComponent,
    resolve: {
      facility: FacilityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacilityUpdateComponent,
    resolve: {
      facility: FacilityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacilityUpdateComponent,
    resolve: {
      facility: FacilityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default facilityRoute;
