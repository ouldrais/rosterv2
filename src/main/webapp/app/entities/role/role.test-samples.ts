import { IRole, NewRole } from './role.model';

export const sampleWithRequiredData: IRole = {
  id: 7747,
};

export const sampleWithPartialData: IRole = {
  id: 22412,
};

export const sampleWithFullData: IRole = {
  key: 15834,
  id: 31984,
};

export const sampleWithNewData: NewRole = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
