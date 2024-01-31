import { IShift } from 'app/entities/shift/shift.model';
import { ITask } from 'app/entities/task/task.model';
import { IPosition } from 'app/entities/position/position.model';
import { IDepartment } from 'app/entities/department/department.model';

export interface IShiftDemand {
  id: number;
  count?: number | null;
  shift?: IShift | null;
  task?: ITask | null;
  position?: IPosition | null;
  department?: IDepartment | null;
}

export type NewShiftDemand = Omit<IShiftDemand, 'id'> & { id: null };
