export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown'
}

export interface UnsterilizedCat {
    gender: Gender,
    mediaLinks: string[],
    observations: string
}

export interface SterilizedCat {
    gender: Gender,
    mediaLinks: string[],
    observations: string,
    hospitalizationDate: string,
    releaseDate: string,
    volunteerName: string
}
