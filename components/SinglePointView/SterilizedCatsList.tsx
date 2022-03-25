import { SterilizedCat } from '../../models/cat.model';
import styles from './DetailsModal.module.css';

interface Props{
    isEditable: boolean,
    cat: SterilizedCat
}

const SterilizedCatsList = (props: Props) => {
    return (
        <form className={styles.catListItem}>
            <label>Data internare</label>
            <input type="text" defaultValue={props.cat.hospitalizationDate} readOnly={!props.isEditable}></input>
            <label>Data externare</label>
            <input type="text" defaultValue={props.cat.releaseDate} readOnly={!props.isEditable}></input>
            <label>Sex</label>
            <input type="text" defaultValue={props.cat.sex} readOnly={!props.isEditable}></input>
            <label>Voluntar</label>
            <input type="text" defaultValue={props.cat.volunteerName} readOnly={!props.isEditable}></input>
            <label>Media</label>
            <input type="text" defaultValue={props.cat.mediaLinks} readOnly={!props.isEditable}></input>
            <label>Observatii</label>
            <input type="text" defaultValue={props.cat.observations} readOnly={!props.isEditable}></input>
        </form> 
    );
}

export default SterilizedCatsList;