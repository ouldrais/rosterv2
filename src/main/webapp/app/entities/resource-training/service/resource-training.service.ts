import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResourceTraining, NewResourceTraining } from '../resource-training.model';

export type PartialUpdateResourceTraining = Partial<IResourceTraining> & Pick<IResourceTraining, 'id'>;

type RestOf<T extends IResourceTraining | NewResourceTraining> = Omit<T, 'activeFrom' | 'activeto'> & {
  activeFrom?: string | null;
  activeto?: string | null;
};

export type RestResourceTraining = RestOf<IResourceTraining>;

export type NewRestResourceTraining = RestOf<NewResourceTraining>;

export type PartialUpdateRestResourceTraining = RestOf<PartialUpdateResourceTraining>;

export type EntityResponseType = HttpResponse<IResourceTraining>;
export type EntityArrayResponseType = HttpResponse<IResourceTraining[]>;

@Injectable({ providedIn: 'root' })
export class ResourceTrainingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resource-trainings');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(resourceTraining: NewResourceTraining): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resourceTraining);
    return this.http
      .post<RestResourceTraining>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(resourceTraining: IResourceTraining): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resourceTraining);
    return this.http
      .put<RestResourceTraining>(`${this.resourceUrl}/${this.getResourceTrainingIdentifier(resourceTraining)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(resourceTraining: PartialUpdateResourceTraining): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resourceTraining);
    return this.http
      .patch<RestResourceTraining>(`${this.resourceUrl}/${this.getResourceTrainingIdentifier(resourceTraining)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestResourceTraining>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestResourceTraining[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResourceTrainingIdentifier(resourceTraining: Pick<IResourceTraining, 'id'>): number {
    return resourceTraining.id;
  }

  compareResourceTraining(o1: Pick<IResourceTraining, 'id'> | null, o2: Pick<IResourceTraining, 'id'> | null): boolean {
    return o1 && o2 ? this.getResourceTrainingIdentifier(o1) === this.getResourceTrainingIdentifier(o2) : o1 === o2;
  }

  addResourceTrainingToCollectionIfMissing<Type extends Pick<IResourceTraining, 'id'>>(
    resourceTrainingCollection: Type[],
    ...resourceTrainingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resourceTrainings: Type[] = resourceTrainingsToCheck.filter(isPresent);
    if (resourceTrainings.length > 0) {
      const resourceTrainingCollectionIdentifiers = resourceTrainingCollection.map(
        resourceTrainingItem => this.getResourceTrainingIdentifier(resourceTrainingItem)!,
      );
      const resourceTrainingsToAdd = resourceTrainings.filter(resourceTrainingItem => {
        const resourceTrainingIdentifier = this.getResourceTrainingIdentifier(resourceTrainingItem);
        if (resourceTrainingCollectionIdentifiers.includes(resourceTrainingIdentifier)) {
          return false;
        }
        resourceTrainingCollectionIdentifiers.push(resourceTrainingIdentifier);
        return true;
      });
      return [...resourceTrainingsToAdd, ...resourceTrainingCollection];
    }
    return resourceTrainingCollection;
  }

  protected convertDateFromClient<T extends IResourceTraining | NewResourceTraining | PartialUpdateResourceTraining>(
    resourceTraining: T,
  ): RestOf<T> {
    return {
      ...resourceTraining,
      activeFrom: resourceTraining.activeFrom?.toJSON() ?? null,
      activeto: resourceTraining.activeto?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restResourceTraining: RestResourceTraining): IResourceTraining {
    return {
      ...restResourceTraining,
      activeFrom: restResourceTraining.activeFrom ? dayjs(restResourceTraining.activeFrom) : undefined,
      activeto: restResourceTraining.activeto ? dayjs(restResourceTraining.activeto) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestResourceTraining>): HttpResponse<IResourceTraining> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestResourceTraining[]>): HttpResponse<IResourceTraining[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
