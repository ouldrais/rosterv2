import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeamPlan, NewTeamPlan } from '../team-plan.model';

export type PartialUpdateTeamPlan = Partial<ITeamPlan> & Pick<ITeamPlan, 'id'>;

export type EntityResponseType = HttpResponse<ITeamPlan>;
export type EntityArrayResponseType = HttpResponse<ITeamPlan[]>;

@Injectable({ providedIn: 'root' })
export class TeamPlanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/team-plans');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(teamPlan: NewTeamPlan): Observable<EntityResponseType> {
    return this.http.post<ITeamPlan>(this.resourceUrl, teamPlan, { observe: 'response' });
  }

  update(teamPlan: ITeamPlan): Observable<EntityResponseType> {
    return this.http.put<ITeamPlan>(`${this.resourceUrl}/${this.getTeamPlanIdentifier(teamPlan)}`, teamPlan, { observe: 'response' });
  }

  partialUpdate(teamPlan: PartialUpdateTeamPlan): Observable<EntityResponseType> {
    return this.http.patch<ITeamPlan>(`${this.resourceUrl}/${this.getTeamPlanIdentifier(teamPlan)}`, teamPlan, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeamPlan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeamPlan[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTeamPlanIdentifier(teamPlan: Pick<ITeamPlan, 'id'>): number {
    return teamPlan.id;
  }

  compareTeamPlan(o1: Pick<ITeamPlan, 'id'> | null, o2: Pick<ITeamPlan, 'id'> | null): boolean {
    return o1 && o2 ? this.getTeamPlanIdentifier(o1) === this.getTeamPlanIdentifier(o2) : o1 === o2;
  }

  addTeamPlanToCollectionIfMissing<Type extends Pick<ITeamPlan, 'id'>>(
    teamPlanCollection: Type[],
    ...teamPlansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const teamPlans: Type[] = teamPlansToCheck.filter(isPresent);
    if (teamPlans.length > 0) {
      const teamPlanCollectionIdentifiers = teamPlanCollection.map(teamPlanItem => this.getTeamPlanIdentifier(teamPlanItem)!);
      const teamPlansToAdd = teamPlans.filter(teamPlanItem => {
        const teamPlanIdentifier = this.getTeamPlanIdentifier(teamPlanItem);
        if (teamPlanCollectionIdentifiers.includes(teamPlanIdentifier)) {
          return false;
        }
        teamPlanCollectionIdentifiers.push(teamPlanIdentifier);
        return true;
      });
      return [...teamPlansToAdd, ...teamPlanCollection];
    }
    return teamPlanCollection;
  }
}
