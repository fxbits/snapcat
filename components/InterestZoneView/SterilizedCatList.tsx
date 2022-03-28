import { SterilizedCat } from '../../models/cat.model';
import styles from './InterestZoneView.module.css';

interface Props{
    isEditable: boolean,
    cat: SterilizedCat,
    onChange: () => void
}

const SterilizedCatsList = (props: Props) => {
    const onChange = () => {
        props.onChange();
    };

    return (
        <form className={styles.catListItem}>
            <label>Data internare</label>
            <input id="sterilized-cat-indate-input" type="text" defaultValue={props.cat.hospitalizationDate} readOnly={!props.isEditable}></input>
            <label>Data externare</label>
            <input id="sterilized-cat-outdate-input" type="text" defaultValue={props.cat.releaseDate} readOnly={!props.isEditable}></input>
            <label>Sex</label>
            <input id="sterilized-cat-sex-input" type="text" defaultValue={props.cat.sex} readOnly={!props.isEditable}></input>
            <label>Voluntar</label>
            <input id="sterilized-cat-volunteer-input" type="text" defaultValue={props.cat.volunteerName} readOnly={!props.isEditable}></input>
            <label>Media</label>
            <input id="sterilized-cat-media-input" type="text" defaultValue={props.cat.mediaLinks} readOnly={!props.isEditable}></input>
            <label>Observatii</label>
            <input id="sterilized-cat-observations-input" type="text" defaultValue={props.cat.observations} readOnly={!props.isEditable}></input>
        </form> 
    );
}

export default SterilizedCatsList;
