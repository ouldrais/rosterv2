import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPositionRequirement } from '../position-requirement.model';
import { PositionRequirementService } from '../service/position-requirement.service';

export const positionRequirementResolve = (route: ActivatedRouteSnapshot): Observable<null | IPositionRequirement> => {
  const id = route.params['id'];
  if (id) {
    return inject(PositionRequirementService)
      .find(id)
      .pipe(
        mergeMap((positionRequirement: HttpResponse<IPositionRequirement>) => {
          if (positionRequirement.body) {
            return of(positionRequirement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default positionRequirementResolve;
