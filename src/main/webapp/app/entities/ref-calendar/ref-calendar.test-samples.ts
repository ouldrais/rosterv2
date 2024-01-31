import { IRefCalendar, NewRefCalendar } from './ref-calendar.model';

export const sampleWithRequiredData: IRefCalendar = {
  id: 29818,
};

export const sampleWithPartialData: IRefCalendar = {
  key: 7747,
  id: 29086,
  status: 'amend lest',
};

export const sampleWithFullData: IRefCalendar = {
  key: 29033,
  id: 28286,
  status: 'drat fooey',
};

export const sampleWithNewData: NewRefCalendar = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
