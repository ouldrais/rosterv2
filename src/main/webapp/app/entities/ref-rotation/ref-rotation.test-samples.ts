import { IRefRotation, NewRefRotation } from './ref-rotation.model';

export const sampleWithRequiredData: IRefRotation = {
  id: 12481,
};

export const sampleWithPartialData: IRefRotation = {
  id: 1300,
  order: 5858,
};

export const sampleWithFullData: IRefRotation = {
  id: 28018,
  order: 2341,
};

export const sampleWithNewData: NewRefRotation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
