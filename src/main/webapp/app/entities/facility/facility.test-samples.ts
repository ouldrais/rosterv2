import { IFacility, NewFacility } from './facility.model';

export const sampleWithRequiredData: IFacility = {
  id: 24225,
};

export const sampleWithPartialData: IFacility = {
  id: 13662,
};

export const sampleWithFullData: IFacility = {
  key: 22746,
  id: 4149,
};

export const sampleWithNewData: NewFacility = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
