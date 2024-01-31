import { IPositionRequirement, NewPositionRequirement } from './position-requirement.model';

export const sampleWithRequiredData: IPositionRequirement = {
  id: 32541,
};

export const sampleWithPartialData: IPositionRequirement = {
  id: 28272,
};

export const sampleWithFullData: IPositionRequirement = {
  id: 21602,
  mandatoty: 'offensively despite',
};

export const sampleWithNewData: NewPositionRequirement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
