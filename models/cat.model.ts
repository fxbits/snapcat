export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export interface UnsterilizedCat {
  _id: string;
  gender: Gender;
  mediaLinks: string[];
  observations: string;
}

export interface SterilizedCat {
  _id: string;
  gender: Gender;
  mediaLinks: string[];
  observations: string;
  hospitalizationDate: string;
  releaseDate: string;
  volunteerName: string;
}
export type Cat = UnsterilizedCat | SterilizedCat;
