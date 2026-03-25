import '@/styles/globals.css';
import 'react-phone-input-2/lib/style.css';

import { AppCacheProvider, createEmotionCache } from '@mui/material-nextjs/v15-pagesRouter';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { AppProps } from 'next/app';
import { EmotionCache } from '@emotion/cache';
import { GLOBAL_MUI_THEME } from '../styles/global.theme';
import { GlobalStyles } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
const clientCache = createEmotionCache({ enableCssLayer: true, key: 'css' });

export default function App(props: AppProps & { emotionCache?: EmotionCache }) {
  const { Component, pageProps, emotionCache = clientCache } = props;
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const blockContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        return;
      }

      e.preventDefault();
    };

    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeys);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  return (
    <AppCacheProvider {...props} emotionCache={emotionCache}>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={GLOBAL_MUI_THEME}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Component {...pageProps} />
          <Toaster position="top-center" richColors />
        </LocalizationProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
