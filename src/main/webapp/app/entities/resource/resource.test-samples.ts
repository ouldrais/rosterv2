import { IResource, NewResource } from './resource.model';

export const sampleWithRequiredData: IResource = {
  id: 30988,
};

export const sampleWithPartialData: IResource = {
  id: 27745,
};

export const sampleWithFullData: IResource = {
  id: 19926,
  key: 26488,
  firstName: 'Meghan',
  lastName: 'MacGyver',
  teamRole: 'brr',
  exchangeAllowed: false,
};

export const sampleWithNewData: NewResource = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
