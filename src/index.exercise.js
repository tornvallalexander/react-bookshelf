import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './app'
import {ReactQueryConfigProvider} from 'react-query';

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    retry: (failureCount, error) => {
      if (error.status === 404) return false
      else return failureCount < 2;
    }
  }
}

// ignore the rootRef in this file. I'm just doing it here to make
// the tests I write to check your work easier.
export const rootRef = {}
loadDevTools(() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>
  )
  rootRef.current = root
})
