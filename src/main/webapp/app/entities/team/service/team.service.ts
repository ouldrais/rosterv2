import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeam, NewTeam } from '../team.model';

export type PartialUpdateTeam = Partial<ITeam> & Pick<ITeam, 'id'>;

export type EntityResponseType = HttpResponse<ITeam>;
export type EntityArrayResponseType = HttpResponse<ITeam[]>;

@Injectable({ providedIn: 'root' })
export class TeamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/teams');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(team: NewTeam): Observable<EntityResponseType> {
    return this.http.post<ITeam>(this.resourceUrl, team, { observe: 'response' });
  }

  update(team: ITeam): Observable<EntityResponseType> {
    return this.http.put<ITeam>(`${this.resourceUrl}/${this.getTeamIdentifier(team)}`, team, { observe: 'response' });
  }

  partialUpdate(team: PartialUpdateTeam): Observable<EntityResponseType> {
    return this.http.patch<ITeam>(`${this.resourceUrl}/${this.getTeamIdentifier(team)}`, team, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeam>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeam[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTeamIdentifier(team: Pick<ITeam, 'id'>): number {
    return team.id;
  }

  compareTeam(o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean {
    return o1 && o2 ? this.getTeamIdentifier(o1) === this.getTeamIdentifier(o2) : o1 === o2;
  }

  addTeamToCollectionIfMissing<Type extends Pick<ITeam, 'id'>>(
    teamCollection: Type[],
    ...teamsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const teams: Type[] = teamsToCheck.filter(isPresent);
    if (teams.length > 0) {
      const teamCollectionIdentifiers = teamCollection.map(teamItem => this.getTeamIdentifier(teamItem)!);
      const teamsToAdd = teams.filter(teamItem => {
        const teamIdentifier = this.getTeamIdentifier(teamItem);
        if (teamCollectionIdentifiers.includes(teamIdentifier)) {
          return false;
        }
        teamCollectionIdentifiers.push(teamIdentifier);
        return true;
      });
      return [...teamsToAdd, ...teamCollection];
    }
    return teamCollection;
  }
}
