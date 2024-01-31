export interface ITeam {
  key?: number | null;
  id: number;
}

export type NewTeam = Omit<ITeam, 'id'> & { id: null };
