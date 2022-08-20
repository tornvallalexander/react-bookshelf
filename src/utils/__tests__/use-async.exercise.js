import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

const deferred = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    promise,
    resolve,
    reject,
  }
}

const defaultHookState = {
  error: null,
  data: null,
  status: 'idle',

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  setData: expect.any(Function),
  setError: expect.any(Function),
  run: expect.any(Function),
  reset: expect.any(Function),
}

const pendingHookState = {
    error: null,
    data: null,
    status: 'pending',

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()

  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(defaultHookState)

  let p
  await act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingHookState)

  const resolvedValue = Symbol('some value') // makes sure it matches the exact data as it is passed
  await act(async () => {
    resolve(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    error: null,
    data: resolvedValue,
    status: 'resolved',

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  await act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(defaultHookState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()

  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(defaultHookState)

  let p
  await act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingHookState)

  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue)
    await p.catch(() => {
      // catching error, test will take care of it
    })
  })

  expect(result.current).toEqual({
    error: rejectedValue,
    data: null,
    status: 'rejected',

    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  await act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(defaultHookState)
})
// 🐨 this will be very similar to the previous test, except you'll reject the
// promise instead and assert on the error state.
// 💰 to avoid the promise actually failing your test, you can catch
//    the promise returned from `run` with `.catch(() => {})`

test.todo('can specify an initial state')
// 💰 useAsync(customInitialState)

test.todo('can set the data')
// 💰 result.current.setData('whatever you want')

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')
