import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';

import HeaderGoogle from '../components/HeaderGoogle/HeaderGoogle';
import Map from '../components/Map/Map';
import useInterestZones from '../components/hooks/useInterestZones';
import { useState } from 'react';

function MapPage() {
  const { interestZones } = useInterestZones();
  const [searchAdress, setSeachAdress] = useState<string>();
  return (
    <>
      <HeaderGoogle setSearchAdress={setSeachAdress}></HeaderGoogle>
      <MobileDrawer zones={interestZones || []} />
      <DesktopDrawer zones={interestZones || []} />
      <Map searchAdress={searchAdress} />
    </>
  );
}

export default withPageAuthRequired(MapPage);
