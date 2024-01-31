import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPositionRequirement, NewPositionRequirement } from '../position-requirement.model';

export type PartialUpdatePositionRequirement = Partial<IPositionRequirement> & Pick<IPositionRequirement, 'id'>;

export type EntityResponseType = HttpResponse<IPositionRequirement>;
export type EntityArrayResponseType = HttpResponse<IPositionRequirement[]>;

@Injectable({ providedIn: 'root' })
export class PositionRequirementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/position-requirements');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(positionRequirement: NewPositionRequirement): Observable<EntityResponseType> {
    return this.http.post<IPositionRequirement>(this.resourceUrl, positionRequirement, { observe: 'response' });
  }

  update(positionRequirement: IPositionRequirement): Observable<EntityResponseType> {
    return this.http.put<IPositionRequirement>(
      `${this.resourceUrl}/${this.getPositionRequirementIdentifier(positionRequirement)}`,
      positionRequirement,
      { observe: 'response' },
    );
  }

  partialUpdate(positionRequirement: PartialUpdatePositionRequirement): Observable<EntityResponseType> {
    return this.http.patch<IPositionRequirement>(
      `${this.resourceUrl}/${this.getPositionRequirementIdentifier(positionRequirement)}`,
      positionRequirement,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPositionRequirement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPositionRequirement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPositionRequirementIdentifier(positionRequirement: Pick<IPositionRequirement, 'id'>): number {
    return positionRequirement.id;
  }

  comparePositionRequirement(o1: Pick<IPositionRequirement, 'id'> | null, o2: Pick<IPositionRequirement, 'id'> | null): boolean {
    return o1 && o2 ? this.getPositionRequirementIdentifier(o1) === this.getPositionRequirementIdentifier(o2) : o1 === o2;
  }

  addPositionRequirementToCollectionIfMissing<Type extends Pick<IPositionRequirement, 'id'>>(
    positionRequirementCollection: Type[],
    ...positionRequirementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const positionRequirements: Type[] = positionRequirementsToCheck.filter(isPresent);
    if (positionRequirements.length > 0) {
      const positionRequirementCollectionIdentifiers = positionRequirementCollection.map(
        positionRequirementItem => this.getPositionRequirementIdentifier(positionRequirementItem)!,
      );
      const positionRequirementsToAdd = positionRequirements.filter(positionRequirementItem => {
        const positionRequirementIdentifier = this.getPositionRequirementIdentifier(positionRequirementItem);
        if (positionRequirementCollectionIdentifiers.includes(positionRequirementIdentifier)) {
          return false;
        }
        positionRequirementCollectionIdentifiers.push(positionRequirementIdentifier);
        return true;
      });
      return [...positionRequirementsToAdd, ...positionRequirementCollection];
    }
    return positionRequirementCollection;
  }
}
