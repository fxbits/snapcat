import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import { MantineProvider } from '@mantine/core';
import Layout from '../components/Layout/Layout';
import theme from '../styles/theme';
import { ModalProvider } from '../components/Providers/ModalProvider';
import CatProvider from '../components/Providers/CatProvider';
import ZoneProvider from '../components/Providers/ZoneProvider';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}>
      <UserProvider>
        <ZoneProvider>
          <CatProvider>
            <ModalProvider>
              <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </MantineProvider>
            </ModalProvider>
          </CatProvider>
        </ZoneProvider>
      </UserProvider>
    </SWRConfig>
  );
}

export default MyApp;
