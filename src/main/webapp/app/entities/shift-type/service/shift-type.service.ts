import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShiftType, NewShiftType } from '../shift-type.model';

export type PartialUpdateShiftType = Partial<IShiftType> & Pick<IShiftType, 'id'>;

type RestOf<T extends IShiftType | NewShiftType> = Omit<T, 'start' | 'end'> & {
  start?: string | null;
  end?: string | null;
};

export type RestShiftType = RestOf<IShiftType>;

export type NewRestShiftType = RestOf<NewShiftType>;

export type PartialUpdateRestShiftType = RestOf<PartialUpdateShiftType>;

export type EntityResponseType = HttpResponse<IShiftType>;
export type EntityArrayResponseType = HttpResponse<IShiftType[]>;

@Injectable({ providedIn: 'root' })
export class ShiftTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shift-types');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(shiftType: NewShiftType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftType);
    return this.http
      .post<RestShiftType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shiftType: IShiftType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftType);
    return this.http
      .put<RestShiftType>(`${this.resourceUrl}/${this.getShiftTypeIdentifier(shiftType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(shiftType: PartialUpdateShiftType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftType);
    return this.http
      .patch<RestShiftType>(`${this.resourceUrl}/${this.getShiftTypeIdentifier(shiftType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShiftType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShiftType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShiftTypeIdentifier(shiftType: Pick<IShiftType, 'id'>): number {
    return shiftType.id;
  }

  compareShiftType(o1: Pick<IShiftType, 'id'> | null, o2: Pick<IShiftType, 'id'> | null): boolean {
    return o1 && o2 ? this.getShiftTypeIdentifier(o1) === this.getShiftTypeIdentifier(o2) : o1 === o2;
  }

  addShiftTypeToCollectionIfMissing<Type extends Pick<IShiftType, 'id'>>(
    shiftTypeCollection: Type[],
    ...shiftTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shiftTypes: Type[] = shiftTypesToCheck.filter(isPresent);
    if (shiftTypes.length > 0) {
      const shiftTypeCollectionIdentifiers = shiftTypeCollection.map(shiftTypeItem => this.getShiftTypeIdentifier(shiftTypeItem)!);
      const shiftTypesToAdd = shiftTypes.filter(shiftTypeItem => {
        const shiftTypeIdentifier = this.getShiftTypeIdentifier(shiftTypeItem);
        if (shiftTypeCollectionIdentifiers.includes(shiftTypeIdentifier)) {
          return false;
        }
        shiftTypeCollectionIdentifiers.push(shiftTypeIdentifier);
        return true;
      });
      return [...shiftTypesToAdd, ...shiftTypeCollection];
    }
    return shiftTypeCollection;
  }

  protected convertDateFromClient<T extends IShiftType | NewShiftType | PartialUpdateShiftType>(shiftType: T): RestOf<T> {
    return {
      ...shiftType,
      start: shiftType.start?.toJSON() ?? null,
      end: shiftType.end?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restShiftType: RestShiftType): IShiftType {
    return {
      ...restShiftType,
      start: restShiftType.start ? dayjs(restShiftType.start) : undefined,
      end: restShiftType.end ? dayjs(restShiftType.end) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShiftType>): HttpResponse<IShiftType> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestShiftType[]>): HttpResponse<IShiftType[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
