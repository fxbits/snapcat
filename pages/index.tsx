import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Welcome from './components/Welcome';

const MainApp = () => {
  const { user, error, isLoading } = useUser();

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
      </div>
    );
  }

  return(
    <Link href="/api/auth/login">Login</Link>
//   )
};

export default MainApp;


import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

function HomePage() {
    // const googlemap = useRef(null);
    

    useEffect(() => {
        const loader = new Loader({
          apiKey: 'AIzaSyDf1IQC97H-wcy-cvF--wsNSTVK4bmkVYw',
          version: 'weekly',
        });
        let map;
        loader.load().then(() => {
          const google = window.google;
          map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
          });
        });
      });

  return (
    <div id="map"  />
  );
}
export default HomePage;