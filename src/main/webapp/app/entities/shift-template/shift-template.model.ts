import dayjs from 'dayjs/esm';

export interface IShiftTemplate {
  id: number;
  key?: number | null;
  shiftStart?: dayjs.Dayjs | null;
  shiftEnd?: dayjs.Dayjs | null;
  type?: string | null;
}

export type NewShiftTemplate = Omit<IShiftTemplate, 'id'> & { id: null };
