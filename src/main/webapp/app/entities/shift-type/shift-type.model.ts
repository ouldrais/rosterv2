import dayjs from 'dayjs/esm';

export interface IShiftType {
  key?: number | null;
  id: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
}

export type NewShiftType = Omit<IShiftType, 'id'> & { id: null };
