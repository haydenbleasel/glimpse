import type { AppProps } from 'next/app';
import type { FC } from 'react';
import '../styles/globals.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default MyApp;
