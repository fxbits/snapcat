import DetailsForm from '../InterestZoneView/DetailsForm';
import { zoneServiceUi } from '../../ui/ZoneServices';

import Box from '@mui/material/Box';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import { InterestZone } from '../../models/zone.model';

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

  const handleClose = useCallback(() => {
    props.onClose();
  }, []);

  return (
    <Box >
      <DetailsForm onChange={setNewZone} isEditable={true} zone={props.zone} />
      <div>
        <Button
          variant='contained'
          color='success'
          onClick={handleSave}
          style={{ margin: '10px' }}>
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
