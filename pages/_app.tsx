import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          dark: ['#D4D4D4', '#848484', '#505050', '#343434', '#1E1E1E', '#1A1A1A', '#161616', '#131313', '#101010', '#080808']
        },
        colorScheme: 'dark'
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  )
}
