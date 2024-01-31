export interface IRole {
  key?: number | null;
  id: number;
}

export type NewRole = Omit<IRole, 'id'> & { id: null };
