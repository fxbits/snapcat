import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';

import HeaderGoogle from '../components/HeaderGoogle/HeaderGoogle';
import Map from '../components/Map/Map';
import useInterestZones from '../components/hooks/useInterestZones';
import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function MapPage() {
  const { interestZones } = useInterestZones();
  const [searchAdress, setSearchAddress] = useState<string>();
  return (
    <>
      <HeaderGoogle setSearchAdress={setSearchAddress}></HeaderGoogle>
      <MobileDrawer zones={interestZones || []} />
      <DesktopDrawer zones={interestZones || []} />
      <Map searchAdress={searchAdress}  setSearchAddress={setSearchAddress} />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'errors']))
    }
  };
}

export default withPageAuthRequired(MapPage);
