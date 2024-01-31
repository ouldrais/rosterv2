import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShiftTemplate } from '../shift-template.model';
import { ShiftTemplateService } from '../service/shift-template.service';

export const shiftTemplateResolve = (route: ActivatedRouteSnapshot): Observable<null | IShiftTemplate> => {
  const id = route.params['id'];
  if (id) {
    return inject(ShiftTemplateService)
      .find(id)
      .pipe(
        mergeMap((shiftTemplate: HttpResponse<IShiftTemplate>) => {
          if (shiftTemplate.body) {
            return of(shiftTemplate.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default shiftTemplateResolve;
