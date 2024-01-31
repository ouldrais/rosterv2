import dayjs from 'dayjs/esm';

import { IResourceTraining, NewResourceTraining } from './resource-training.model';

export const sampleWithRequiredData: IResourceTraining = {
  id: 30282,
};

export const sampleWithPartialData: IResourceTraining = {
  id: 4198,
  level: 'sabre throughout provided',
  trainer: 'padlock',
  activeto: dayjs('2024-01-31T17:00'),
};

export const sampleWithFullData: IResourceTraining = {
  id: 17917,
  status: 'next',
  level: 'to',
  trainer: 'ouch direct',
  activeFrom: dayjs('2024-01-31T14:02'),
  activeto: dayjs('2024-01-31T07:31'),
};

export const sampleWithNewData: NewResourceTraining = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
