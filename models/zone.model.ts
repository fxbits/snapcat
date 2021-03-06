import { SterilizedCat, UnsterilizedCat } from './cat.model';

export enum Status {
  TODO = 'todo',
  DONE = 'done',
  INPROGRESS = 'inProgress',
}

export interface Address {
  name: string;
  lat: number;
  lng: number;
}

interface Person {
  name: string;
  phone: string;
}

export interface InterestZone {
  _id: string;
  address: Address;
  noUnsterilizedCats: number;
  status: Status;
  contactPerson?: Person;
  volunteerName: string;
  observations: string;
  unsterilizedCats: UnsterilizedCat[];
  sterilizedCats: SterilizedCat[];
}
