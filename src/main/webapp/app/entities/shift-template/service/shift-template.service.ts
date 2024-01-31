import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShiftTemplate, NewShiftTemplate } from '../shift-template.model';

export type PartialUpdateShiftTemplate = Partial<IShiftTemplate> & Pick<IShiftTemplate, 'id'>;

type RestOf<T extends IShiftTemplate | NewShiftTemplate> = Omit<T, 'shiftStart' | 'shiftEnd'> & {
  shiftStart?: string | null;
  shiftEnd?: string | null;
};

export type RestShiftTemplate = RestOf<IShiftTemplate>;

export type NewRestShiftTemplate = RestOf<NewShiftTemplate>;

export type PartialUpdateRestShiftTemplate = RestOf<PartialUpdateShiftTemplate>;

export type EntityResponseType = HttpResponse<IShiftTemplate>;
export type EntityArrayResponseType = HttpResponse<IShiftTemplate[]>;

@Injectable({ providedIn: 'root' })
export class ShiftTemplateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shift-templates');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(shiftTemplate: NewShiftTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftTemplate);
    return this.http
      .post<RestShiftTemplate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shiftTemplate: IShiftTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftTemplate);
    return this.http
      .put<RestShiftTemplate>(`${this.resourceUrl}/${this.getShiftTemplateIdentifier(shiftTemplate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(shiftTemplate: PartialUpdateShiftTemplate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shiftTemplate);
    return this.http
      .patch<RestShiftTemplate>(`${this.resourceUrl}/${this.getShiftTemplateIdentifier(shiftTemplate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShiftTemplate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShiftTemplate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShiftTemplateIdentifier(shiftTemplate: Pick<IShiftTemplate, 'id'>): number {
    return shiftTemplate.id;
  }

  compareShiftTemplate(o1: Pick<IShiftTemplate, 'id'> | null, o2: Pick<IShiftTemplate, 'id'> | null): boolean {
    return o1 && o2 ? this.getShiftTemplateIdentifier(o1) === this.getShiftTemplateIdentifier(o2) : o1 === o2;
  }

  addShiftTemplateToCollectionIfMissing<Type extends Pick<IShiftTemplate, 'id'>>(
    shiftTemplateCollection: Type[],
    ...shiftTemplatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shiftTemplates: Type[] = shiftTemplatesToCheck.filter(isPresent);
    if (shiftTemplates.length > 0) {
      const shiftTemplateCollectionIdentifiers = shiftTemplateCollection.map(
        shiftTemplateItem => this.getShiftTemplateIdentifier(shiftTemplateItem)!,
      );
      const shiftTemplatesToAdd = shiftTemplates.filter(shiftTemplateItem => {
        const shiftTemplateIdentifier = this.getShiftTemplateIdentifier(shiftTemplateItem);
        if (shiftTemplateCollectionIdentifiers.includes(shiftTemplateIdentifier)) {
          return false;
        }
        shiftTemplateCollectionIdentifiers.push(shiftTemplateIdentifier);
        return true;
      });
      return [...shiftTemplatesToAdd, ...shiftTemplateCollection];
    }
    return shiftTemplateCollection;
  }

  protected convertDateFromClient<T extends IShiftTemplate | NewShiftTemplate | PartialUpdateShiftTemplate>(shiftTemplate: T): RestOf<T> {
    return {
      ...shiftTemplate,
      shiftStart: shiftTemplate.shiftStart?.toJSON() ?? null,
      shiftEnd: shiftTemplate.shiftEnd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restShiftTemplate: RestShiftTemplate): IShiftTemplate {
    return {
      ...restShiftTemplate,
      shiftStart: restShiftTemplate.shiftStart ? dayjs(restShiftTemplate.shiftStart) : undefined,
      shiftEnd: restShiftTemplate.shiftEnd ? dayjs(restShiftTemplate.shiftEnd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShiftTemplate>): HttpResponse<IShiftTemplate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestShiftTemplate[]>): HttpResponse<IShiftTemplate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
