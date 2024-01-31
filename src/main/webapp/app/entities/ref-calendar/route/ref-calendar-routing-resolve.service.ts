import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRefCalendar } from '../ref-calendar.model';
import { RefCalendarService } from '../service/ref-calendar.service';

export const refCalendarResolve = (route: ActivatedRouteSnapshot): Observable<null | IRefCalendar> => {
  const id = route.params['id'];
  if (id) {
    return inject(RefCalendarService)
      .find(id)
      .pipe(
        mergeMap((refCalendar: HttpResponse<IRefCalendar>) => {
          if (refCalendar.body) {
            return of(refCalendar.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default refCalendarResolve;
