import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeamPlan } from '../team-plan.model';
import { TeamPlanService } from '../service/team-plan.service';

export const teamPlanResolve = (route: ActivatedRouteSnapshot): Observable<null | ITeamPlan> => {
  const id = route.params['id'];
  if (id) {
    return inject(TeamPlanService)
      .find(id)
      .pipe(
        mergeMap((teamPlan: HttpResponse<ITeamPlan>) => {
          if (teamPlan.body) {
            return of(teamPlan.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default teamPlanResolve;
