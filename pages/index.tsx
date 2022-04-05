import Welcome from '../components/Welcome/Welcome';
import { InterestZone } from '../models/zone.model';
import InterestZoneAdd from '../components/InterestZoneAdd/InterestZoneAdd';
import styles from '../styles/index.module.css';
import Map from './map';

import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';


const MainApp = () => {
  const { user, error, isLoading } = useUser();
  const [zone, setZone] = useState<InterestZone>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const openEditModal = useCallback(() => {
    setEditModalVisible(true);
  }, [editModalVisible]);

  const closeEditModal = useCallback(() => {
    setEditModalVisible(false);
  }, [editModalVisible]);

  const displayAddModal = useCallback(() => {
    setAddModalVisible(true);
  }, [addModalVisible]);

  const closeAddModal = useCallback(() => {
    setAddModalVisible(false);
  }, [addModalVisible]);

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.container}>{error.message}</div>;
  }

  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <p>Welcome {user.name}!</p> 
          <Link href="/map">Open map</Link>
          <Link href="/api/auth/logout">Logout</Link>
        </div>
      </div>
    );
  }
  
  return(
    <div className={styles.container}>
      <Link href="/api/auth/login">Login</Link>
    </div>
  )};
 

export default MainApp;
         

