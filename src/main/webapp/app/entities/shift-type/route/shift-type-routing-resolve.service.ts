import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShiftType } from '../shift-type.model';
import { ShiftTypeService } from '../service/shift-type.service';

export const shiftTypeResolve = (route: ActivatedRouteSnapshot): Observable<null | IShiftType> => {
  const id = route.params['id'];
  if (id) {
    return inject(ShiftTypeService)
      .find(id)
      .pipe(
        mergeMap((shiftType: HttpResponse<IShiftType>) => {
          if (shiftType.body) {
            return of(shiftType.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default shiftTypeResolve;
