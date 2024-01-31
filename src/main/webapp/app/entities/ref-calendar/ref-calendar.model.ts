import { IShiftType } from 'app/entities/shift-type/shift-type.model';

export interface IRefCalendar {
  key?: number | null;
  id: number;
  status?: string | null;
  shiftType?: IShiftType | null;
}

export type NewRefCalendar = Omit<IRefCalendar, 'id'> & { id: null };
