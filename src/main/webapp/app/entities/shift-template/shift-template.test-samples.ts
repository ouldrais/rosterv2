import dayjs from 'dayjs/esm';

import { IShiftTemplate, NewShiftTemplate } from './shift-template.model';

export const sampleWithRequiredData: IShiftTemplate = {
  id: 4095,
};

export const sampleWithPartialData: IShiftTemplate = {
  id: 21876,
  key: 30790,
  type: 'so',
};

export const sampleWithFullData: IShiftTemplate = {
  id: 4256,
  key: 26021,
  shiftStart: dayjs('2024-01-31T10:14'),
  shiftEnd: dayjs('2024-01-31T16:41'),
  type: 'smell',
};

export const sampleWithNewData: NewShiftTemplate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
