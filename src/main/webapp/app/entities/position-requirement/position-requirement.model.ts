import { ITraining } from 'app/entities/training/training.model';
import { IPosition } from 'app/entities/position/position.model';

export interface IPositionRequirement {
  id: number;
  mandatoty?: string | null;
  training?: ITraining | null;
  position?: IPosition | null;
}

export type NewPositionRequirement = Omit<IPositionRequirement, 'id'> & { id: null };
