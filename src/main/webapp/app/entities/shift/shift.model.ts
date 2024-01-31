import dayjs from 'dayjs/esm';

export interface IShift {
  id: number;
  key?: number | null;
  shiftStart?: dayjs.Dayjs | null;
  shiftEnd?: dayjs.Dayjs | null;
  type?: string | null;
}

export type NewShift = Omit<IShift, 'id'> & { id: null };
