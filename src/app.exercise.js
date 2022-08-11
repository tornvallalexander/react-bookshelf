/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks';
import {FullPageSpinner} from './components/lib';

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data?.user
  }

  return user
}

function App() {
  const {
    data: user,
    setData: setUser,
    run,
    error,
    isError,
    isLoading,
    isIdle,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => auth.logout().finally(() => setUser(null))

  if (isLoading || isIdle) return <FullPageSpinner />

  if (isError) return (
    <div style={{ color: "orangered"}}>
      <p>Uh oh... there's a problem.</p>
      <pre>{error}</pre>
    </div>
  )

  return user
    ? <AuthenticatedApp user={user} logout={logout} />
    : <UnauthenticatedApp login={login} register={register} />
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
