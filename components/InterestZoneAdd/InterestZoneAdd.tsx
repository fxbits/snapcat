import DetailsForm from '../InterestZoneModal/DetailsForm';
import { zoneServiceUi } from '../../ui/ZoneServices';

import Box from '@mui/material/Box';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import { InterestZone } from '../../models/zone.model';
import { showNotification } from '@mantine/notifications';

interface Props {
  onClose: () => void;
  isVisible: boolean;
  zone: Partial<InterestZone>;
}

const InterestZoneAdd = (props: Props) => {
  const [newZone, setNewZone] = useState<any>();

  const handleSave = () => {
    zoneServiceUi.addZone(newZone);
  };
  //TODO: refactor zoneServicesUi with swr and getServerSideProps
  const handleClose = useCallback(() => {
    props.onClose();
  }, []);

  return (
    <Box>
      <DetailsForm onChange={setNewZone} isEditable={true} zone={props.zone} />
      <div>
        <Button variant='contained' color='success' style={{ margin: '10px' }}
          onClick={ () => {
            handleSave
            showNotification({
              title: 'Added successfully',
              message: 'A zone has been added!',
              color: 'green'
            })}
          }
        >
          Save
        </Button>
        <Button variant='outlined' color='error' onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </Box>
  );
};

export default InterestZoneAdd;
