import type { AppProps } from "next/app"

import "../styles/global.css" // hide body initially for desktop

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
