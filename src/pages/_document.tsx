import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default class _Document extends Document {

  render() {
    return (
      <Html>
        <Head>
          {/* favicon */}
          <link rel="icon" href="/abel body.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
