import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShift } from '../shift.model';
import { ShiftService } from '../service/shift.service';

export const shiftResolve = (route: ActivatedRouteSnapshot): Observable<null | IShift> => {
  const id = route.params['id'];
  if (id) {
    return inject(ShiftService)
      .find(id)
      .pipe(
        mergeMap((shift: HttpResponse<IShift>) => {
          if (shift.body) {
            return of(shift.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default shiftResolve;
