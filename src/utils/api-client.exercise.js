async function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
  if (!res.ok) {
    throw new Error(`Something went wrong :(`)
  } else {
    return await res.json()
  }
}

export {client}

/*






























💰 spoiler alert below...



























































const config = {
    method: 'GET',
    ...customConfig,
  }
*/
