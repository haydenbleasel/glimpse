import type { AppProps } from 'next/app';
import type { FC } from 'react';
import '../styles/globals.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const ComponentX = Component as unknown as FC<AppProps>;

  return <ComponentX {...pageProps} />;
};

export default MyApp;
