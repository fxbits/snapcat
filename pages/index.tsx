import InteresZoneView from '../components/InterestZoneView/InterestZoneView';
import Welcome from '../components/Welcome/Welcome';
import { InterestZone } from '../models/zone.model';
import { zoneServiceUi } from '../ui/ZoneService';
import InterestZoneAdd from '../components/InterestZoneAdd/InterestZoneAdd';

import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';

const MainApp = () => {
  const { user, error, isLoading } = useUser();
  const [zone, setZone] = useState<InterestZone>();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const baseURL = "http://localhost:3000/api/interest-zones/";
  const idTest = "623aff0e6a541cfe8c68308d"; /// 623aff0e6a541cfe8c68308d    /// 6239d2c0b2e9c1fe796d8496

  useEffect(
    () => {
      zoneServiceUi.findById(baseURL + idTest).then(item => setZone(item));
    }, []);

  const displayEditModal = useCallback(() => {
    setOpenEditModal(true);
  }, [openEditModal]);

  const closeEditModal = useCallback(() => {
    setOpenEditModal(false);
  }, [openEditModal]);

  const displayAddModal = useCallback(() => {
    setOpenAddModal(true);
  }, [openAddModal]);

  const closeAddModal = useCallback(() => {
    setOpenAddModal(false);
  }, [openAddModal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>{error.message}</div>;
  }
 

  if (user) {
    return (
      <div>
        Welcome {user.name}! 
        <br></br>
        <Link href="/api/auth/logout">Logout</Link>
        <br></br>
        <Welcome user={user}/>
        <Button variant="contained" onClick={displayEditModal}>Open zone</Button>
        <InteresZoneView onClose={closeEditModal} isVisible={openEditModal} zone={zone!}/>
        <Button variant="contained" onClick={displayAddModal}>Add zone</Button>
        <InterestZoneAdd onClose={closeAddModal} isVisible={openAddModal}/>
        
      </div>
    );
  }

  return(
    <Link href="/api/auth/login">Login</Link>
  )};


export default MainApp;
         


