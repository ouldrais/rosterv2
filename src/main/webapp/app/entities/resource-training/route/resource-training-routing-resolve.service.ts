import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResourceTraining } from '../resource-training.model';
import { ResourceTrainingService } from '../service/resource-training.service';

export const resourceTrainingResolve = (route: ActivatedRouteSnapshot): Observable<null | IResourceTraining> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResourceTrainingService)
      .find(id)
      .pipe(
        mergeMap((resourceTraining: HttpResponse<IResourceTraining>) => {
          if (resourceTraining.body) {
            return of(resourceTraining.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resourceTrainingResolve;
