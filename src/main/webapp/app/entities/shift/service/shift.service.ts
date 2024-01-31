import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShift, NewShift } from '../shift.model';

export type PartialUpdateShift = Partial<IShift> & Pick<IShift, 'id'>;

type RestOf<T extends IShift | NewShift> = Omit<T, 'shiftStart' | 'shiftEnd'> & {
  shiftStart?: string | null;
  shiftEnd?: string | null;
};

export type RestShift = RestOf<IShift>;

export type NewRestShift = RestOf<NewShift>;

export type PartialUpdateRestShift = RestOf<PartialUpdateShift>;

export type EntityResponseType = HttpResponse<IShift>;
export type EntityArrayResponseType = HttpResponse<IShift[]>;

@Injectable({ providedIn: 'root' })
export class ShiftService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shifts');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(shift: NewShift): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shift);
    return this.http.post<RestShift>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shift: IShift): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shift);
    return this.http
      .put<RestShift>(`${this.resourceUrl}/${this.getShiftIdentifier(shift)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(shift: PartialUpdateShift): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shift);
    return this.http
      .patch<RestShift>(`${this.resourceUrl}/${this.getShiftIdentifier(shift)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShift>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShift[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShiftIdentifier(shift: Pick<IShift, 'id'>): number {
    return shift.id;
  }

  compareShift(o1: Pick<IShift, 'id'> | null, o2: Pick<IShift, 'id'> | null): boolean {
    return o1 && o2 ? this.getShiftIdentifier(o1) === this.getShiftIdentifier(o2) : o1 === o2;
  }

  addShiftToCollectionIfMissing<Type extends Pick<IShift, 'id'>>(
    shiftCollection: Type[],
    ...shiftsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shifts: Type[] = shiftsToCheck.filter(isPresent);
    if (shifts.length > 0) {
      const shiftCollectionIdentifiers = shiftCollection.map(shiftItem => this.getShiftIdentifier(shiftItem)!);
      const shiftsToAdd = shifts.filter(shiftItem => {
        const shiftIdentifier = this.getShiftIdentifier(shiftItem);
        if (shiftCollectionIdentifiers.includes(shiftIdentifier)) {
          return false;
        }
        shiftCollectionIdentifiers.push(shiftIdentifier);
        return true;
      });
      return [...shiftsToAdd, ...shiftCollection];
    }
    return shiftCollection;
  }

  protected convertDateFromClient<T extends IShift | NewShift | PartialUpdateShift>(shift: T): RestOf<T> {
    return {
      ...shift,
      shiftStart: shift.shiftStart?.toJSON() ?? null,
      shiftEnd: shift.shiftEnd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restShift: RestShift): IShift {
    return {
      ...restShift,
      shiftStart: restShift.shiftStart ? dayjs(restShift.shiftStart) : undefined,
      shiftEnd: restShift.shiftEnd ? dayjs(restShift.shiftEnd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShift>): HttpResponse<IShift> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestShift[]>): HttpResponse<IShift[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
