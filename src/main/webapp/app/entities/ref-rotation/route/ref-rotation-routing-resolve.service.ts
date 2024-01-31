import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRefRotation } from '../ref-rotation.model';
import { RefRotationService } from '../service/ref-rotation.service';

export const refRotationResolve = (route: ActivatedRouteSnapshot): Observable<null | IRefRotation> => {
  const id = route.params['id'];
  if (id) {
    return inject(RefRotationService)
      .find(id)
      .pipe(
        mergeMap((refRotation: HttpResponse<IRefRotation>) => {
          if (refRotation.body) {
            return of(refRotation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default refRotationResolve;
