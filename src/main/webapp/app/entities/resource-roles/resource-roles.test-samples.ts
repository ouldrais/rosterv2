import { IResourceRoles, NewResourceRoles } from './resource-roles.model';

export const sampleWithRequiredData: IResourceRoles = {
  id: 28854,
};

export const sampleWithPartialData: IResourceRoles = {
  id: 4423,
};

export const sampleWithFullData: IResourceRoles = {
  id: 8906,
};

export const sampleWithNewData: NewResourceRoles = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
