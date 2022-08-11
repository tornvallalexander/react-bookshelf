import * as auth from '../auth-provider';

const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {data, token, headers: customHeaders, ...customConfig} = {},
  retry = false,
) {
  const config = {
    method: data ? 'POST' : 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      if (retry) {
        await auth.logout()
        window.location.assign(window.location)
        return
      } else {
        return client(
          endpoint,
          {data, token, headers: customHeaders, ...customConfig},
          true
        )
      }
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
