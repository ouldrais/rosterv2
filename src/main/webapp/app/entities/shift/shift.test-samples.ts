import dayjs from 'dayjs/esm';

import { IShift, NewShift } from './shift.model';

export const sampleWithRequiredData: IShift = {
  id: 25961,
};

export const sampleWithPartialData: IShift = {
  id: 11508,
  key: 6611,
  shiftEnd: dayjs('2024-01-31T16:39'),
};

export const sampleWithFullData: IShift = {
  id: 16093,
  key: 3831,
  shiftStart: dayjs('2024-01-31T04:31'),
  shiftEnd: dayjs('2024-01-31T23:17'),
  type: 'oof the plight',
};

export const sampleWithNewData: NewShift = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
