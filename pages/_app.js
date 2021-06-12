import { useEffect } from 'react';
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.lang = 'pl';
  });
  return <Component {...pageProps} />
}
