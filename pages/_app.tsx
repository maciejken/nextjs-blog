import { useEffect } from 'react';
import '../styles/global.css';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.lang = 'pl';
  });
  return <Component {...pageProps} />
}
