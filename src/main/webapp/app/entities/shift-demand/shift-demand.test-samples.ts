import { IShiftDemand, NewShiftDemand } from './shift-demand.model';

export const sampleWithRequiredData: IShiftDemand = {
  id: 28104,
};

export const sampleWithPartialData: IShiftDemand = {
  id: 19586,
};

export const sampleWithFullData: IShiftDemand = {
  id: 10140,
  count: 31159,
};

export const sampleWithNewData: NewShiftDemand = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
