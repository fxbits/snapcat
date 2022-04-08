import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import ProviderZone from '../components/Providers/ProviderZone';
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ProviderZone>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Component {...pageProps} />
        </MantineProvider>
      </ProviderZone>
    </UserProvider>
  );
}

export default MyApp;
