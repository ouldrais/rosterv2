import { ITeam, NewTeam } from './team.model';

export const sampleWithRequiredData: ITeam = {
  id: 19566,
};

export const sampleWithPartialData: ITeam = {
  key: 302,
  id: 8722,
};

export const sampleWithFullData: ITeam = {
  key: 13904,
  id: 23767,
};

export const sampleWithNewData: NewTeam = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
