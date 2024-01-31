import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRefRotation, NewRefRotation } from '../ref-rotation.model';

export type PartialUpdateRefRotation = Partial<IRefRotation> & Pick<IRefRotation, 'id'>;

export type EntityResponseType = HttpResponse<IRefRotation>;
export type EntityArrayResponseType = HttpResponse<IRefRotation[]>;

@Injectable({ providedIn: 'root' })
export class RefRotationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ref-rotations');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(refRotation: NewRefRotation): Observable<EntityResponseType> {
    return this.http.post<IRefRotation>(this.resourceUrl, refRotation, { observe: 'response' });
  }

  update(refRotation: IRefRotation): Observable<EntityResponseType> {
    return this.http.put<IRefRotation>(`${this.resourceUrl}/${this.getRefRotationIdentifier(refRotation)}`, refRotation, {
      observe: 'response',
    });
  }

  partialUpdate(refRotation: PartialUpdateRefRotation): Observable<EntityResponseType> {
    return this.http.patch<IRefRotation>(`${this.resourceUrl}/${this.getRefRotationIdentifier(refRotation)}`, refRotation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRefRotation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRefRotation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRefRotationIdentifier(refRotation: Pick<IRefRotation, 'id'>): number {
    return refRotation.id;
  }

  compareRefRotation(o1: Pick<IRefRotation, 'id'> | null, o2: Pick<IRefRotation, 'id'> | null): boolean {
    return o1 && o2 ? this.getRefRotationIdentifier(o1) === this.getRefRotationIdentifier(o2) : o1 === o2;
  }

  addRefRotationToCollectionIfMissing<Type extends Pick<IRefRotation, 'id'>>(
    refRotationCollection: Type[],
    ...refRotationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const refRotations: Type[] = refRotationsToCheck.filter(isPresent);
    if (refRotations.length > 0) {
      const refRotationCollectionIdentifiers = refRotationCollection.map(
        refRotationItem => this.getRefRotationIdentifier(refRotationItem)!,
      );
      const refRotationsToAdd = refRotations.filter(refRotationItem => {
        const refRotationIdentifier = this.getRefRotationIdentifier(refRotationItem);
        if (refRotationCollectionIdentifiers.includes(refRotationIdentifier)) {
          return false;
        }
        refRotationCollectionIdentifiers.push(refRotationIdentifier);
        return true;
      });
      return [...refRotationsToAdd, ...refRotationCollection];
    }
    return refRotationCollection;
  }
}
