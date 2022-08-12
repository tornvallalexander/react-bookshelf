// 🐨 get the queryCache from 'react-query'
import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

const deparallelize = (callbackfn) => {
  const busy = new Map()
  let current
  return async (...args) => {
    if (!busy.has(...args)) {
      busy.set(...args, true)
      const promise = callbackfn(...args)
      current = promise.finally(() => busy.delete(...args))
    }
    return current
  }
}

async function _client(
  endpoint,
  {data, token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      // 🐨 call queryCache.clear() to clear all user data from react-query
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

const client = deparallelize(_client)

export {client}
