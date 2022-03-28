import { InterestZone } from '../../models/zone.model';
import styles from './InterestZoneView.module.css';

interface Props{
    isEditable: boolean,
    zone: InterestZone,
    onChange: () => void
}

const DetailsForm = (props: Props) => {
    const onChange = () => {
        props.onChange();
    };

    return(
        <form className={styles.form}>
            <label>Adresa</label>
            <input id="interest-zone-address-input" type="text" defaultValue={props.zone?.address.name} readOnly={!props.isEditable}></input>
            <label>Latitudine</label>
            <input type="text" defaultValue={props.zone?.address.lat} readOnly></input>
            <label>Longitudine</label>
            <input type="text" defaultValue={props.zone?.address.lng} readOnly></input>
            <label>Numar pisici nesterilizate</label>
            <input id="interest-zone-unsterilized-input" type="text" defaultValue={props.zone?.unsterilizedCats.length} readOnly={!props.isEditable} ></input>
            <label>Numar pisici sterilizate</label>
            <input id="interest-zone-sterilized-input" type="text" defaultValue={props.zone?.sterilizedCats.length} readOnly={!props.isEditable}></input>
            <label>Status</label>
            <input id="interest-zone-status-input" type="text" defaultValue={props.zone?.status} readOnly={!props.isEditable}></input>
            <label>Nume persoana de contact</label>
            <input id="interest-zone-contact-name-input" type="text" defaultValue={props.zone?.contactPerson?.name} readOnly={!props.isEditable}></input>
            <label>Numar de telefon</label>
            <input id="interest-zone-contact-phone-input" type="text" defaultValue={props.zone?.contactPerson?.phone} readOnly={!props.isEditable}></input>
            <label>Observatii</label>
            <input id="interest-zone-observations-input" type="text" defaultValue={props.zone?.observations} readOnly={!props.isEditable}></input>
        </form>
    );
}

export default DetailsForm;
