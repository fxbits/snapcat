import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import GoogleMap from './GoogleMap'

function MyApp({ Component, pageProps }: AppProps) {
  return  (
	<UserProvider>
  		<Component {...pageProps} />
	</UserProvider>
	);
}

export default MyApp
