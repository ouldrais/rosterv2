import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRefCalendar, NewRefCalendar } from '../ref-calendar.model';

export type PartialUpdateRefCalendar = Partial<IRefCalendar> & Pick<IRefCalendar, 'id'>;

export type EntityResponseType = HttpResponse<IRefCalendar>;
export type EntityArrayResponseType = HttpResponse<IRefCalendar[]>;

@Injectable({ providedIn: 'root' })
export class RefCalendarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ref-calendars');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(refCalendar: NewRefCalendar): Observable<EntityResponseType> {
    return this.http.post<IRefCalendar>(this.resourceUrl, refCalendar, { observe: 'response' });
  }

  update(refCalendar: IRefCalendar): Observable<EntityResponseType> {
    return this.http.put<IRefCalendar>(`${this.resourceUrl}/${this.getRefCalendarIdentifier(refCalendar)}`, refCalendar, {
      observe: 'response',
    });
  }

  partialUpdate(refCalendar: PartialUpdateRefCalendar): Observable<EntityResponseType> {
    return this.http.patch<IRefCalendar>(`${this.resourceUrl}/${this.getRefCalendarIdentifier(refCalendar)}`, refCalendar, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRefCalendar>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRefCalendar[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRefCalendarIdentifier(refCalendar: Pick<IRefCalendar, 'id'>): number {
    return refCalendar.id;
  }

  compareRefCalendar(o1: Pick<IRefCalendar, 'id'> | null, o2: Pick<IRefCalendar, 'id'> | null): boolean {
    return o1 && o2 ? this.getRefCalendarIdentifier(o1) === this.getRefCalendarIdentifier(o2) : o1 === o2;
  }

  addRefCalendarToCollectionIfMissing<Type extends Pick<IRefCalendar, 'id'>>(
    refCalendarCollection: Type[],
    ...refCalendarsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const refCalendars: Type[] = refCalendarsToCheck.filter(isPresent);
    if (refCalendars.length > 0) {
      const refCalendarCollectionIdentifiers = refCalendarCollection.map(
        refCalendarItem => this.getRefCalendarIdentifier(refCalendarItem)!,
      );
      const refCalendarsToAdd = refCalendars.filter(refCalendarItem => {
        const refCalendarIdentifier = this.getRefCalendarIdentifier(refCalendarItem);
        if (refCalendarCollectionIdentifiers.includes(refCalendarIdentifier)) {
          return false;
        }
        refCalendarCollectionIdentifiers.push(refCalendarIdentifier);
        return true;
      });
      return [...refCalendarsToAdd, ...refCalendarCollection];
    }
    return refCalendarCollection;
  }
}
