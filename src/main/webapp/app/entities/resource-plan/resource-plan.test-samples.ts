import { IResourcePlan, NewResourcePlan } from './resource-plan.model';

export const sampleWithRequiredData: IResourcePlan = {
  id: 12965,
};

export const sampleWithPartialData: IResourcePlan = {
  id: 25856,
};

export const sampleWithFullData: IResourcePlan = {
  id: 14113,
  availability: false,
};

export const sampleWithNewData: NewResourcePlan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
