import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResource } from '../resource.model';
import { ResourceService } from '../service/resource.service';

export const resourceResolve = (route: ActivatedRouteSnapshot): Observable<null | IResource> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResourceService)
      .find(id)
      .pipe(
        mergeMap((resource: HttpResponse<IResource>) => {
          if (resource.body) {
            return of(resource.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resourceResolve;
