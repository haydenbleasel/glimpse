import type { AppProps } from 'next/app';
import type { FC } from 'react';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default MyApp;
