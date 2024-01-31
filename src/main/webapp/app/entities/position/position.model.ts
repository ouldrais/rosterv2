import { IDepartment } from 'app/entities/department/department.model';

export interface IPosition {
  id: number;
  key?: number | null;
  leadership?: string | null;
  department?: IDepartment | null;
}

export type NewPosition = Omit<IPosition, 'id'> & { id: null };
