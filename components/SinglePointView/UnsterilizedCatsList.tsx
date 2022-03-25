import { UnsterilizedCat } from '../../models/cat.model';
import styles from './DetailsModal.module.css';

interface Props{
    isEditable: boolean,
    cat: UnsterilizedCat
}

const UnsterilizedCatsList = (props: Props) => {
    return (
        <form className={styles.catListItem}>
            <label>Sex</label>
            <input type="text" defaultValue={props.cat.sex} readOnly={!props.isEditable}></input>
            <label>Voluntar</label>
            <input type="text" defaultValue={props.cat.mediaLinks} readOnly={!props.isEditable}></input>
            <label>Observatii</label>
            <input type="text" defaultValue={props.cat.observations} readOnly={!props.isEditable}></input>
        </form> 
    );
}

export default UnsterilizedCatsList;