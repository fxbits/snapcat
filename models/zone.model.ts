import { SterilizedCat, UnsterilizedCat } from './cat.model'

enum Status {
    todo = 'To Do',
    done = 'Done',
    inprogress = 'In Progress'
}

export interface InterestZone {
    id: string,
    address: {
        name: string,
        lat: number,
        lng: number
    },
    noUnsterilizedCats?: number,
    status: Status,
    contactPerson?: {
        name: string,
        phone: string
    },
    volunteerID?: string, // could also be the name
    observations: string,
    unsterilizedCats: UnsterilizedCat[],
    sterilizedCats: SterilizedCat[]
}