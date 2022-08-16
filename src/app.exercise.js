import * as React from 'react'
import {useAuth} from './context/auth-context'
// 🐨 you'll want to render the FullPageSpinner as the fallback
import {FullPageSpinner} from './components/lib'

const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))
const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */'./authenticated-app'))

function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp/> : <UnauthenticatedApp/>}
    </React.Suspense>
  )
}

export {App}
