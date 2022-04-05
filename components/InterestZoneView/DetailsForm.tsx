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
    zone?: Partial<InterestZone>,
    onChange: (data: any) => void,
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
        props.onChange(newZone);
    };

    const onInputChange = (event: any) => {
        const {value, name} = event.target;
        setNewZone({
            ...newZone,
            [name]: value
        });
    }

    const [status, setStatus] = useState(props.zone?.status || "To Do");

    const [newZone, setNewZone] = useState({});

    const [addressError, setAddressError] = useState('');
    const [nonSterilizedCatsError, setNonSterilizedCatsError] = useState('');
    const [sterilizedCatsError, setSterilizedCatsError] = useState('');
    const [nameError, setNameError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    };

    return(
        <form className={styles.form} onChange={onChange}>
                 
            <TextField 
                name = "address" 
                error = {!!addressError}
                helperText = {addressError} 
                defaultValue = {props.zone?.address?.name} 
                label = 'Adresa'
                onChange={e => {
                    addressValidation(e, setAddressError)
                    onInputChange(e)
                }}
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />
                
            <TextField
                name = "status"
                select
                label = "Status"
                onChange = {e => {
                    handleChange
                    onInputChange(e)
                }}
                defaultValue = {status || props.zone?.status}
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
                name = "lat"
                defaultValue = {props.zone?.address?.lat} 
                label = 'Latitudine'
                onChange = {e => onInputChange(e)}  
                InputProps = {{
                    readOnly: true
                }}
            />

            <TextField
                name = "lng"  
                defaultValue = {props.zone?.address?.lng} 
                label = 'Longitudine'
                onChange = {e => onInputChange(e)}  
                InputProps = {{
                    disabled: true,
                }}
            />

            <TextField
                name = "unsterilizedCats"
                error = {nonSterilizedCatsError !== ""}
                helperText = {nonSterilizedCatsError}   
                defaultValue = {props.zone?.unsterilizedCats?.length} 
                label = 'Numar pisici nesterilizate'
                type = 'number'
                onChange={e => {
                    nonSterilizedCatsValidation(e, setNonSterilizedCatsError)
                    onInputChange(e)
                }} 
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <TextField
                name = "sterilizedCats"
                error = {sterilizedCatsError !== ""}
                helperText = {sterilizedCatsError}   
                defaultValue={props.zone?.sterilizedCats?.length} 
                label='Numar pisici sterilizate'
                type = 'number'
                onChange={e => {
                    sterilizedCatsValidation(e, setSterilizedCatsError)
                    onInputChange(e)
                }}   
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <TextField
                name = "contactName" 
                error = {nameError !== ""}
                helperText = {nameError}    
                defaultValue = {props.zone?.contactPerson?.name} 
                label = 'Persoana de contact'  
                onChange={e => {
                    nameValidation(e, setNameError)
                    onInputChange(e)
                }} 
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <InputMask 
                name = "phoneNumber" 
                mask="+4\0 999 999 999" 
                defaultValue = {props.zone?.contactPerson?.phone} 
                readOnly = {!props.isEditable} 
                placeholder = 'Numar de telefon'
                onChange={e => onInputChange(e)} 
            />

            <TextField  
                name = "observations" 
                defaultValue = {props.zone?.observations} 
                label = 'Observatii'  
                onChange={e => onInputChange(e)}
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />

            <TextField  
                name = "volunteerName" 
                defaultValue = {props.zone?.volunteerName} 
                label = 'Voluntarul responsabil'  
                onChange={e => onInputChange(e)}
                InputProps = {{
                    readOnly: !props.isEditable,
                }}
            />  
        </form>
    );
}

export default DetailsForm;
