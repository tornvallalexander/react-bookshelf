import {server, rest} from 'test/server'
import {client} from '../api-client'

const apiURL = process.env.REACT_APP_API_URL

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})

const getFullURL = (endpoint) => `${apiURL}/${endpoint}`

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(getFullURL(endpoint), async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    })
  )

  const res = await client(endpoint)
  expect(res).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const endpoint = 'test-endpoint'
  const token = 'FAKE_TOKEN'
  const mockResult = {mockValue: 'VALUE'}

  let request

  server.use(
    rest.get(getFullURL(endpoint), async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    })
  )

  void await client(endpoint, {token})
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}

  let request

  server.use(
    rest.put(getFullURL(endpoint), async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    })
  )

  const customConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'fake-type',
    }
  }

  void await client(endpoint, customConfig)

  expect(request.headers.get('Content-Type')).toBe('fake-type')
})
// 🐨 do a very similar setup to the previous test
// 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
// 🐨 call the client with the endpoint and the custom config
// 🐨 verify the request had the correct properties

test.todo(
  'when data is provided, it is stringified and the method defaults to POST',
)
// 🐨 create a mock data object
// 🐨 create a server handler very similar to the previous ones to handle the post request
//    💰 Use rest.post instead of rest.get like we've been doing so far
// 🐨 call client with an endpoint and an object with the data
//    💰 client(endpoint, {data})
// 🐨 verify the request.body is equal to the mock data object you passed
