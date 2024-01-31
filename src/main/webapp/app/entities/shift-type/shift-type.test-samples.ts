import dayjs from 'dayjs/esm';

import { IShiftType, NewShiftType } from './shift-type.model';

export const sampleWithRequiredData: IShiftType = {
  id: 10186,
};

export const sampleWithPartialData: IShiftType = {
  id: 2312,
};

export const sampleWithFullData: IShiftType = {
  key: 21727,
  id: 15422,
  start: dayjs('2024-01-31T22:34'),
  end: dayjs('2024-01-31T08:40'),
};

export const sampleWithNewData: NewShiftType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
