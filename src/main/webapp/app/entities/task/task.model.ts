export interface ITask {
  key?: number | null;
  id: number;
  description?: string | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
