import { ITeamPlan, NewTeamPlan } from './team-plan.model';

export const sampleWithRequiredData: ITeamPlan = {
  id: 1207,
};

export const sampleWithPartialData: ITeamPlan = {
  id: 18665,
};

export const sampleWithFullData: ITeamPlan = {
  id: 4938,
};

export const sampleWithNewData: NewTeamPlan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
