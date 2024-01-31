export interface IFacility {
  key?: number | null;
  id: number;
}

export type NewFacility = Omit<IFacility, 'id'> & { id: null };
