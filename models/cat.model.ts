export interface UnsterilizedCat {
    sex: string,
    mediaLinks: string[],
    observations: string
}

export interface SterilizedCat {
    sex: string,
    mediaLinks: string[],
    observations: string,
    hospitalizationDate: string,
    releaseDate: string,
    volunteerID: string // or volunteer name
}