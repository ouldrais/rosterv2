export interface ITraining {
  id: number;
  key?: number | null;
  description?: string | null;
}

export type NewTraining = Omit<ITraining, 'id'> & { id: null };
