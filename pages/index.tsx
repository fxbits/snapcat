import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import DetailsModal from '../components/DetailsModal';
import Welcome from './components/Welcome';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { InterestZone } from '../models/zone.model';


const MainApp = () => {
  const { user, error, isLoading } = useUser();
  const [zone, setZone] = useState<any>();
  const baseURL = "http://localhost:3000/api/interest-zones/";
  const idTest = "623aff0e6a541cfe8c68308d";

  useEffect(
    () => {
      getZone();
    }, 
  [])

  const getZone = async () => {

    try {
      const foundZone = await axios.get(baseURL + idTest);
      console.log(foundZone.data);
      setZone(foundZone.data);
    }
    catch(error: any) {
      console.log(error);
    }
  }

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
        <DetailsModal zone={zone}/>
      </div>
    );
  }

  return(
    <Link href="/api/auth/login">Login</Link>
  )
};

export default MainApp;
