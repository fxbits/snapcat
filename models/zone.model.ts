import { SterilizedCat, UnsterilizedCat } from './cat.model'

export enum Status {
    TODO = 'To Do',
    DONE = 'Done',
    INPROGRESS = 'In Progress'
}

interface Address {
    name: string,
    lat: number,
    lng: number
}

interface Person {
    name: string,
    phone: string
}

export interface InterestZone {
    id: string,
    address: Address,
    status: Status,
    contactPerson?: Person,
    volunteerName: string,
    observations: string,
    unsterilizedCats: UnsterilizedCat[],
    sterilizedCats: SterilizedCat[]
}
