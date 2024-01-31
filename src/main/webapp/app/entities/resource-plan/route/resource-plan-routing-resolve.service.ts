import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResourcePlan } from '../resource-plan.model';
import { ResourcePlanService } from '../service/resource-plan.service';

export const resourcePlanResolve = (route: ActivatedRouteSnapshot): Observable<null | IResourcePlan> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResourcePlanService)
      .find(id)
      .pipe(
        mergeMap((resourcePlan: HttpResponse<IResourcePlan>) => {
          if (resourcePlan.body) {
            return of(resourcePlan.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resourcePlanResolve;
