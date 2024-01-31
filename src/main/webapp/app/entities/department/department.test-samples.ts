import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 12558,
};

export const sampleWithPartialData: IDepartment = {
  id: 29468,
  key: 26058,
  team: 'wiretap bid',
};

export const sampleWithFullData: IDepartment = {
  id: 26394,
  key: 3813,
  team: 'cereal brr',
};

export const sampleWithNewData: NewDepartment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
