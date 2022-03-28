import InteresZoneView from '../components/InterestZoneView/InterestZoneView';
import Welcome from '../components/Welcome/Welcome';
import { InterestZone } from '../models/zone.model';
import { zoneServiceUi } from '../ui/ZoneService';

import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';

const MainApp = () => {
  const { user, error, isLoading } = useUser();
  const [zone, setZone] = useState<InterestZone>();
  const [openModal, setOpenModal] = useState(false);
  const baseURL = "http://localhost:3000/api/interest-zones/";
  const idTest = "623aff0e6a541cfe8c68308d"; /// 623aff0e6a541cfe8c68308d    /// 6239d2c0b2e9c1fe796d8496

  useEffect(
    () => {
      zoneServiceUi.findById(baseURL + idTest).then(item => setZone(item));
    }, []);

  const displayModal = useCallback(() => {
    setOpenModal(true);
  }, [openModal]);

  const closeModal = useCallback(() => {
    setOpenModal(false);
  }, [openModal]);

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
        <Button variant="contained" onClick={displayModal}>Open zone</Button>
        <InteresZoneView onClose={closeModal} isVisible={openModal} zone={zone!}/>
      </div>
    );
  }

  return(
    <Link href="/api/auth/login">Login</Link>
  )};


export default MainApp;
         


