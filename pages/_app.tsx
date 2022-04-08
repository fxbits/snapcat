import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import ProviderZone from '../components/Providers/ProviderZone';
import { MantineProvider } from '@mantine/core';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ProviderZone>
        <MantineProvider theme={{ primaryColor: 'orange' }} withGlobalStyles withNormalizeCSS>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ProviderZone>
    </UserProvider>
  );
}

export default MyApp;
