import { IResource } from 'app/entities/resource/resource.model';
import { IShift } from 'app/entities/shift/shift.model';
import { IPosition } from 'app/entities/position/position.model';

export interface IResourcePlan {
  id: number;
  availability?: boolean | null;
  resource?: IResource | null;
  shift?: IShift | null;
  position?: IPosition | null;
}

export type NewResourcePlan = Omit<IResourcePlan, 'id'> & { id: null };
