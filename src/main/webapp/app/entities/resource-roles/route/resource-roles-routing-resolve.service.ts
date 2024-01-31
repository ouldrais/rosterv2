import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResourceRoles } from '../resource-roles.model';
import { ResourceRolesService } from '../service/resource-roles.service';

export const resourceRolesResolve = (route: ActivatedRouteSnapshot): Observable<null | IResourceRoles> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResourceRolesService)
      .find(id)
      .pipe(
        mergeMap((resourceRoles: HttpResponse<IResourceRoles>) => {
          if (resourceRoles.body) {
            return of(resourceRoles.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resourceRolesResolve;
