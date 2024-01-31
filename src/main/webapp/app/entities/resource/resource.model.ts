import { ITeam } from 'app/entities/team/team.model';

export interface IResource {
  id: number;
  key?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  teamRole?: string | null;
  exchangeAllowed?: boolean | null;
  team?: ITeam | null;
}

export type NewResource = Omit<IResource, 'id'> & { id: null };
