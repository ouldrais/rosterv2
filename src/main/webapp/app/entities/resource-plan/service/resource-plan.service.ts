import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResourcePlan, NewResourcePlan } from '../resource-plan.model';

export type PartialUpdateResourcePlan = Partial<IResourcePlan> & Pick<IResourcePlan, 'id'>;

export type EntityResponseType = HttpResponse<IResourcePlan>;
export type EntityArrayResponseType = HttpResponse<IResourcePlan[]>;

@Injectable({ providedIn: 'root' })
export class ResourcePlanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resource-plans');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(resourcePlan: NewResourcePlan): Observable<EntityResponseType> {
    return this.http.post<IResourcePlan>(this.resourceUrl, resourcePlan, { observe: 'response' });
  }

  update(resourcePlan: IResourcePlan): Observable<EntityResponseType> {
    return this.http.put<IResourcePlan>(`${this.resourceUrl}/${this.getResourcePlanIdentifier(resourcePlan)}`, resourcePlan, {
      observe: 'response',
    });
  }

  partialUpdate(resourcePlan: PartialUpdateResourcePlan): Observable<EntityResponseType> {
    return this.http.patch<IResourcePlan>(`${this.resourceUrl}/${this.getResourcePlanIdentifier(resourcePlan)}`, resourcePlan, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResourcePlan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResourcePlan[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResourcePlanIdentifier(resourcePlan: Pick<IResourcePlan, 'id'>): number {
    return resourcePlan.id;
  }

  compareResourcePlan(o1: Pick<IResourcePlan, 'id'> | null, o2: Pick<IResourcePlan, 'id'> | null): boolean {
    return o1 && o2 ? this.getResourcePlanIdentifier(o1) === this.getResourcePlanIdentifier(o2) : o1 === o2;
  }

  addResourcePlanToCollectionIfMissing<Type extends Pick<IResourcePlan, 'id'>>(
    resourcePlanCollection: Type[],
    ...resourcePlansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resourcePlans: Type[] = resourcePlansToCheck.filter(isPresent);
    if (resourcePlans.length > 0) {
      const resourcePlanCollectionIdentifiers = resourcePlanCollection.map(
        resourcePlanItem => this.getResourcePlanIdentifier(resourcePlanItem)!,
      );
      const resourcePlansToAdd = resourcePlans.filter(resourcePlanItem => {
        const resourcePlanIdentifier = this.getResourcePlanIdentifier(resourcePlanItem);
        if (resourcePlanCollectionIdentifiers.includes(resourcePlanIdentifier)) {
          return false;
        }
        resourcePlanCollectionIdentifiers.push(resourcePlanIdentifier);
        return true;
      });
      return [...resourcePlansToAdd, ...resourcePlanCollection];
    }
    return resourcePlanCollection;
  }
}
