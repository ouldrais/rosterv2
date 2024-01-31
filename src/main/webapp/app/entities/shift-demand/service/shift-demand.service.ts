import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShiftDemand, NewShiftDemand } from '../shift-demand.model';

export type PartialUpdateShiftDemand = Partial<IShiftDemand> & Pick<IShiftDemand, 'id'>;

export type EntityResponseType = HttpResponse<IShiftDemand>;
export type EntityArrayResponseType = HttpResponse<IShiftDemand[]>;

@Injectable({ providedIn: 'root' })
export class ShiftDemandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shift-demands');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(shiftDemand: NewShiftDemand): Observable<EntityResponseType> {
    return this.http.post<IShiftDemand>(this.resourceUrl, shiftDemand, { observe: 'response' });
  }

  update(shiftDemand: IShiftDemand): Observable<EntityResponseType> {
    return this.http.put<IShiftDemand>(`${this.resourceUrl}/${this.getShiftDemandIdentifier(shiftDemand)}`, shiftDemand, {
      observe: 'response',
    });
  }

  partialUpdate(shiftDemand: PartialUpdateShiftDemand): Observable<EntityResponseType> {
    return this.http.patch<IShiftDemand>(`${this.resourceUrl}/${this.getShiftDemandIdentifier(shiftDemand)}`, shiftDemand, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShiftDemand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShiftDemand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShiftDemandIdentifier(shiftDemand: Pick<IShiftDemand, 'id'>): number {
    return shiftDemand.id;
  }

  compareShiftDemand(o1: Pick<IShiftDemand, 'id'> | null, o2: Pick<IShiftDemand, 'id'> | null): boolean {
    return o1 && o2 ? this.getShiftDemandIdentifier(o1) === this.getShiftDemandIdentifier(o2) : o1 === o2;
  }

  addShiftDemandToCollectionIfMissing<Type extends Pick<IShiftDemand, 'id'>>(
    shiftDemandCollection: Type[],
    ...shiftDemandsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shiftDemands: Type[] = shiftDemandsToCheck.filter(isPresent);
    if (shiftDemands.length > 0) {
      const shiftDemandCollectionIdentifiers = shiftDemandCollection.map(
        shiftDemandItem => this.getShiftDemandIdentifier(shiftDemandItem)!,
      );
      const shiftDemandsToAdd = shiftDemands.filter(shiftDemandItem => {
        const shiftDemandIdentifier = this.getShiftDemandIdentifier(shiftDemandItem);
        if (shiftDemandCollectionIdentifiers.includes(shiftDemandIdentifier)) {
          return false;
        }
        shiftDemandCollectionIdentifiers.push(shiftDemandIdentifier);
        return true;
      });
      return [...shiftDemandsToAdd, ...shiftDemandCollection];
    }
    return shiftDemandCollection;
  }
}
