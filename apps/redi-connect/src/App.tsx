import { Loader } from '@talent-connect/shared-atomic-design-components'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import AppNotification from './components/AppNotification'
import { Routes } from './components/Routes'
import LocationPicker from './pages/front/landing/LocationPicker'
import {
  getAccessTokenFromLocalStorage,
  isLoggedIn,
  setGraphQlClientAuthHeader,
} from './services/auth/auth'
import { history, Router } from './services/history/history'
import { envRediLocation } from './utils/env-redi-location'
import { useConfetti } from './utils/useConfetti'

function App() {
  useConfetti({ keybind: 'm i r i a m a l w a y s r e d i' })

  switch (envRediLocation()) {
    case 'location-picker':
      return (
        <Suspense fallback={<Loader loading={true} />}>
          <LocationPicker />
        </Suspense>
      )

    default:
      return <NormalRediConnect />
  }
}

// TODO: put this into a lib
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 5 * 60 * 1000,

      //! TODO: Investigate which one of the following or combination thereof is ideal
      // docs here: https://react-query-v3.tanstack.com/guides/important-defaults
      // staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
    },
  },
})

if (isLoggedIn()) {
  setGraphQlClientAuthHeader(getAccessTokenFromLocalStorage())
}

function NormalRediConnect() {
  return (
    <>
      <AppNotification />
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <Suspense fallback={<Loader loading={true} />}>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Routes />
            </QueryParamProvider>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App
