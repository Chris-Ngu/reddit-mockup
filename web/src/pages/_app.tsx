import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { Provider, createClient } from 'urql';

import theme from '../theme'
import { __backend__ } from '../constants';

const client = createClient({ 
  url: __backend__ ,
  fetchOptions: {
    credentials: "include"
  },
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
