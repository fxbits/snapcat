import { UnsterilizedCat } from '../../models/cat.model';
import styles from './InterestZoneView.module.css';

interface Props{
    isEditable: boolean,
    cat: UnsterilizedCat
    onChange: () => void
}

const UnsterilizedCatsList = (props: Props) => {
    const onChange = () => {
        props.onChange();
    };

    return (
        <form className={styles.catListItem}>
            <label>Sex</label>
            <input id="unsterilized-cat-sex-input"  type="text" defaultValue={props.cat.sex} readOnly={!props.isEditable}></input>
            <label>Voluntar</label>
            <input id="unsterilized-cat-volunteer-input" type="text" defaultValue={props.cat.mediaLinks} readOnly={!props.isEditable}></input>
            <label>Observatii</label>
            <input id="unsterilized-cat-observations-input" type="text" defaultValue={props.cat.observations} readOnly={!props.isEditable}></input>
        </form> 
    );
}

export default UnsterilizedCatsList;