import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShiftDemand } from '../shift-demand.model';
import { ShiftDemandService } from '../service/shift-demand.service';

export const shiftDemandResolve = (route: ActivatedRouteSnapshot): Observable<null | IShiftDemand> => {
  const id = route.params['id'];
  if (id) {
    return inject(ShiftDemandService)
      .find(id)
      .pipe(
        mergeMap((shiftDemand: HttpResponse<IShiftDemand>) => {
          if (shiftDemand.body) {
            return of(shiftDemand.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default shiftDemandResolve;
