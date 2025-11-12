import 'regenerator-runtime/runtime'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { GoogleAnalytics } from 'nextjs-google-analytics'

import '../styles/globals.css'
import { useEffect } from 'react'
import { ZustandProvider } from 'state/zustand'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      var r = document.querySelector(':root') as any
      if (window.localStorage.customTheme) {
        r.style.setProperty('--hue', window.localStorage.customTheme)
      }
    }
  }, [])

  return (
    <>
      <GoogleAnalytics
        gtagUrl="https://www.googletagmanager.com/gtag/js?id=G-0B20K0MZW3"
        trackPageViews
      />
      <Head>
        {/* Primary Meta Tags */}
        <title>Talk To Abel</title>
        <meta name="title" content="Talk To Abel" />
        <meta
          name="description"
          content="TalkToAbel.com offers an interactive and engaging experience with an AI powered by ChatGPT. Engage in a conversation today!"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.talktoabel.com/" />
        <meta property="og:title" content="Talk To Abel" />
        <meta
          property="og:description"
          content="TalkToAbel.com offers an interactive and engaging experience with an AI powered by ChatGPT. Engage in a conversation today!"
        />
        <meta
          property="og:image"
          content="https://talktoabel.com/abel%20logo.svg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.talktoabel.com/" />
        <meta property="twitter:title" content="TalkToAbel" />
        <meta
          property="twitter:description"
          content="TalkToAbel.com offers an interactive and engaging experience with an AI powered by ChatGPT. Engage in a conversation today!"
        />
        <meta
          property="twitter:image"
          content="https://talktoabel.com/abel%20logo.svg"
        />

        {/* Other Relevant Tags */}
        <link rel="canonical" href="https://www.talktoabel.com/" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ZustandProvider>
        <Component {...pageProps} />
      </ZustandProvider>
    </>
  )
}
