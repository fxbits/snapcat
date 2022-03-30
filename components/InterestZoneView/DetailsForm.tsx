import { useState } from 'react';
import { InterestZone } from '../../models/zone.model';
import styles from './DetailsForm.module.css';
import { Status } from '../../models/zone.model';
import { addressValidation, nonSterilizedCatsValidation, sterilizedCatsValidation, nameValidation } from '../../utils/validators.utils';

import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import InputMask from 'react-input-mask'; 



interface Props{
    isEditable: boolean,
    zone?: InterestZone,
    onChange: () => void
}

const options = [
    {
        value: Status.TODO,
        label: Status.TODO
    },
    {
        value: Status.INPROGRESS,
        label: Status.INPROGRESS
    },
    {
        value: Status.DONE,
        label: Status.DONE
    }
];

const DetailsForm = (props: Props) => {
    const onChange = () => {
        props.onChange();
    };

    const [status, setStatus] = useState(props.zone?.status || "To Do");

    const [addressError, setAddressError] = useState('');
    const [nonSterilizedCatsError, setNonSterilizedCatsError] = useState('');
    const [sterilizedCatsError, setSterilizedCatsError] = useState('');
    const [nameError, setNameError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    };

    return(
        <form className={styles.form}>
                 
            <TextField 
                error = {!!addressError}
                helperText = {addressError} 
                id = "interest-zone-address-input" 
                defaultValue = {props.zone?.address.name} 
                label = 'Adresa'
                onChange={e => addressValidation(e, setAddressError)} 
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />
                
            <TextField
                id = "interest-zone-status-input"
                select
                label = "Status"
                value = {status}
                onChange = {handleChange}
                defaultValue = {props.zone?.status}
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>


            <TextField  
                defaultValue = {props.zone?.address.lat} 
                label = 'Latitudine'  
                InputProps = {{
                    disabled: true,
                }}
            />

            <TextField  
                defaultValue = {props.zone?.address.lng} 
                label = 'Longitudine'  
                InputProps = {{
                    disabled: true,
                }}
            />

            <TextField
                error = {nonSterilizedCatsError !== ""}
                helperText = {nonSterilizedCatsError}   
                id = "interest-zone-unsterilized-input"
                defaultValue = {props.zone?.unsterilizedCats.length} 
                label = 'Numar pisici nesterilizate'
                type = 'number'
                onChange={e => nonSterilizedCatsValidation(e, setNonSterilizedCatsError)} 
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <TextField
                error = {sterilizedCatsError !== ""}
                helperText = {sterilizedCatsError}   
                id="interest-zone-sterilized-input"
                defaultValue={props.zone?.sterilizedCats.length} 
                label='Numar pisici sterilizate'
                type = 'number'
                onChange={e => sterilizedCatsValidation(e, setSterilizedCatsError)}   
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <TextField  
                error = {nameError !== ""}
                helperText = {nameError}   
                id = "interest-zone-contact-name-input" 
                defaultValue = {props.zone?.contactPerson?.name} 
                label = 'Persoana de contact'  
                onChange={e => nameValidation(e, setNameError)} 
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <InputMask 
                id = "interest-zone-contact-phone-input" 
                mask="+4\0 999 999 999" 
                defaultValue = {props.zone?.contactPerson?.phone} 
                readOnly = {!props.isEditable} 
                placeholder = 'Numar de telefon' 
            />

            <TextField  
                id = "interest-zone-observations-input" 
                defaultValue = {props.zone?.observations} 
                label = 'Observatii'  
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />
        </form>
    );
}

export default DetailsForm;
