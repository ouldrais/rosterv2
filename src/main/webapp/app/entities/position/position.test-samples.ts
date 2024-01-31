import { IPosition, NewPosition } from './position.model';

export const sampleWithRequiredData: IPosition = {
  id: 24981,
};

export const sampleWithPartialData: IPosition = {
  id: 24603,
  key: 29770,
  leadership: 'providence so',
};

export const sampleWithFullData: IPosition = {
  id: 5287,
  key: 32697,
  leadership: 'violet often fooey',
};

export const sampleWithNewData: NewPosition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
