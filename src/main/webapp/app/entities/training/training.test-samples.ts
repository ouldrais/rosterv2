import { ITraining, NewTraining } from './training.model';

export const sampleWithRequiredData: ITraining = {
  id: 26509,
};

export const sampleWithPartialData: ITraining = {
  id: 12242,
};

export const sampleWithFullData: ITraining = {
  id: 11606,
  key: 29274,
  description: 'hmph',
};

export const sampleWithNewData: NewTraining = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
