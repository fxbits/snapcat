import { InterestZone } from '../../models/zone.model';
import styles from './DetailsModal.module.css';

interface Props{
    isEditable: boolean,
    zone: InterestZone
}

const DetailsForm = (props: Props) => {

    return(
    <form className={styles.form}>
        <label>Adresa</label>
        <input type="text" defaultValue={props.zone?.address.name} readOnly={!props.isEditable}></input>
        <label>Latitudine</label>
        <input type="text" defaultValue={props.zone?.address.lat} readOnly={!props.isEditable}></input>
        <label>Longitudine</label>
        <input type="text" defaultValue={props.zone?.address.lng} readOnly={!props.isEditable}></input>
        <label>Numar pisici nesterilizate</label>
        <input type="text" defaultValue={props.zone?.unsterilizedCats.length} readOnly={!props.isEditable} ></input>
        <label>Numar pisici sterilizate</label>
        <input type="text" defaultValue={props.zone?.sterilizedCats.length} readOnly={!props.isEditable}></input>
        <label>Status</label>
        <input type="text" defaultValue={props.zone?.status} readOnly={!props.isEditable}></input>
        <label>Nume persoana de contact</label>
        <input type="text" defaultValue={props.zone?.contactPerson?.name} readOnly={!props.isEditable}></input>
        <label>Numar de telefon</label>
        <input type="text" defaultValue={props.zone?.contactPerson?.phone} readOnly={!props.isEditable}></input>
        <label>Observatii</label>
        <input type="text" defaultValue={props.zone?.observations} readOnly={!props.isEditable}></input>
    </form>
    );
}

export default DetailsForm;