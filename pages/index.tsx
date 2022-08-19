import type { NextPage } from "next"
import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react"

/*
  A demo of mobile-first SSR rendering strategy with Next.js
  The strategy is to always render as mobile on SSR and initial hydration.
  The body is initially hidden for desktop by CSS using media query.
  Then when App gets mounted, determine if the device is mobile.
  If mobile, the body is already visible no re-render happens.
  if desktop, re-renders as desktop and make the body visible.
*/

const query = "(max-width: 816px)" // is the device mobile?

const IsMobileContext = createContext<boolean | undefined>(undefined)

function IsMobileProvider({ children }: { children?: ReactNode }) {
  const [isMobile, setIsMobile] = useState(true) // always render as mobile on first render

  useLayoutEffect(() => {
    document.body.style.display = "block"
    const mql = window.matchMedia(query)

    if (!mql.matches) {
      setIsMobile(false)
    }

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)

    mql.addEventListener("change", handler)

    return () => {
      mql.removeEventListener("change", handler)
    }
  }, [])

  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  )
}

function useIsMobile() {
  return useContext(IsMobileContext)
}

const Home: NextPage = () => {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return <div>desktop</div>
  }

  return <div>mobile device</div>
}

const HomeContainer: NextPage = (props) => {
  return (
    <IsMobileProvider>
      <Home {...props} />
    </IsMobileProvider>
  )
}

export default HomeContainer
