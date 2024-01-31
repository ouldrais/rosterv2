import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 23579,
};

export const sampleWithPartialData: ITask = {
  id: 26691,
};

export const sampleWithFullData: ITask = {
  key: 28073,
  id: 17449,
  description: 'psst not',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
