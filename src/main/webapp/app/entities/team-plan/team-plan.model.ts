import { ITeam } from 'app/entities/team/team.model';
import { IShift } from 'app/entities/shift/shift.model';

export interface ITeamPlan {
  id: number;
  team?: ITeam | null;
  shift?: IShift | null;
}

export type NewTeamPlan = Omit<ITeamPlan, 'id'> & { id: null };
