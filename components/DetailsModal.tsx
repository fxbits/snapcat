import { InterestZone } from '../models/zone.model';


interface Props{
    zone: InterestZone
}

const DetailsModal = (props: Props) => {
    return (
        <div className='detailed-page-container'>
            <div className='address-container'>{props.zone.address}</div>
            <div className='no-sterilizated-cats-container'>{props.zone.sterilizedCats}</div>
            <div className='no-non-sterilizated-cats-container'>{props.zone.unsterilizedCats}</div>
            <div className='personName-container'>{props.zone.contactPerson?.name}</div>
            <div className='personePhone-container'>{props.zone.contactPerson?.phone}</div>
            <div className='volunteerName-container'>{props.zone.volunteerID}</div>
            <div className='observations-container'>{props.zone.observations}</div>
            <button>Edit</button>
        </div>
    );
}

export default DetailsModal;
