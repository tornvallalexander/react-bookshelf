import {act, renderHook} from '@testing-library/react'
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

const stateConstants = {
	setData: expect.any(Function),
	setError: expect.any(Function),
	run: expect.any(Function),
	reset: expect.any(Function),
}

const defaultHookState = {
	error: null,
	data: null,
	status: 'idle',

	isIdle: true,
	isLoading: false,
	isError: false,
	isSuccess: false,

	...stateConstants,
}

const pendingHookState = {
	error: null,
	data: null,
	status: 'pending',

	isIdle: false,
	isLoading: true,
	isError: false,
	isSuccess: false,

	...stateConstants
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

		...stateConstants
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

		...stateConstants
	})

	await act(() => {
		result.current.reset()
	})

	expect(result.current).toEqual(defaultHookState)
})

test('can specify an initial state', async () => {
	const mockData = Symbol('resolved value')
	const customInitialState = {
		status: 'resolved',
		data: mockData,
	}
  const {result} = renderHook(() => useAsync(customInitialState))

	expect(result.current).toEqual({
		...defaultHookState,

		status: 'resolved',
		data: mockData,

		isIdle: false,
		isSuccess: true,
	})
})

test.todo('can set the data')
// 💰 result.current.setData('whatever you want')

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')
