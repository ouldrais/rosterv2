import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResourceRoles, NewResourceRoles } from '../resource-roles.model';

export type PartialUpdateResourceRoles = Partial<IResourceRoles> & Pick<IResourceRoles, 'id'>;

export type EntityResponseType = HttpResponse<IResourceRoles>;
export type EntityArrayResponseType = HttpResponse<IResourceRoles[]>;

@Injectable({ providedIn: 'root' })
export class ResourceRolesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resource-roles');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(resourceRoles: NewResourceRoles): Observable<EntityResponseType> {
    return this.http.post<IResourceRoles>(this.resourceUrl, resourceRoles, { observe: 'response' });
  }

  update(resourceRoles: IResourceRoles): Observable<EntityResponseType> {
    return this.http.put<IResourceRoles>(`${this.resourceUrl}/${this.getResourceRolesIdentifier(resourceRoles)}`, resourceRoles, {
      observe: 'response',
    });
  }

  partialUpdate(resourceRoles: PartialUpdateResourceRoles): Observable<EntityResponseType> {
    return this.http.patch<IResourceRoles>(`${this.resourceUrl}/${this.getResourceRolesIdentifier(resourceRoles)}`, resourceRoles, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResourceRoles>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResourceRoles[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResourceRolesIdentifier(resourceRoles: Pick<IResourceRoles, 'id'>): number {
    return resourceRoles.id;
  }

  compareResourceRoles(o1: Pick<IResourceRoles, 'id'> | null, o2: Pick<IResourceRoles, 'id'> | null): boolean {
    return o1 && o2 ? this.getResourceRolesIdentifier(o1) === this.getResourceRolesIdentifier(o2) : o1 === o2;
  }

  addResourceRolesToCollectionIfMissing<Type extends Pick<IResourceRoles, 'id'>>(
    resourceRolesCollection: Type[],
    ...resourceRolesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resourceRoles: Type[] = resourceRolesToCheck.filter(isPresent);
    if (resourceRoles.length > 0) {
      const resourceRolesCollectionIdentifiers = resourceRolesCollection.map(
        resourceRolesItem => this.getResourceRolesIdentifier(resourceRolesItem)!,
      );
      const resourceRolesToAdd = resourceRoles.filter(resourceRolesItem => {
        const resourceRolesIdentifier = this.getResourceRolesIdentifier(resourceRolesItem);
        if (resourceRolesCollectionIdentifiers.includes(resourceRolesIdentifier)) {
          return false;
        }
        resourceRolesCollectionIdentifiers.push(resourceRolesIdentifier);
        return true;
      });
      return [...resourceRolesToAdd, ...resourceRolesCollection];
    }
    return resourceRolesCollection;
  }
}
