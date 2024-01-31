import { IRole } from 'app/entities/role/role.model';
import { IResource } from 'app/entities/resource/resource.model';

export interface IResourceRoles {
  id: number;
  role?: IRole | null;
  resource?: IResource | null;
}

export type NewResourceRoles = Omit<IResourceRoles, 'id'> & { id: null };
