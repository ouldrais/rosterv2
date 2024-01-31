import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { RefCalendarComponent } from './list/ref-calendar.component';
import { RefCalendarDetailComponent } from './detail/ref-calendar-detail.component';
import { RefCalendarUpdateComponent } from './update/ref-calendar-update.component';
import RefCalendarResolve from './route/ref-calendar-routing-resolve.service';

const refCalendarRoute: Routes = [
  {
    path: '',
    component: RefCalendarComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RefCalendarDetailComponent,
    resolve: {
      refCalendar: RefCalendarResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RefCalendarUpdateComponent,
    resolve: {
      refCalendar: RefCalendarResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RefCalendarUpdateComponent,
    resolve: {
      refCalendar: RefCalendarResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default refCalendarRoute;
