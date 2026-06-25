import { expect, test, afterEach, jest } from '@jest/globals'
import * as Listener from '../src/parts/Listener/Listener.ts'

afterEach(() => {
  for (const id in Listener.state) {
    delete Listener.state[id]
  }
})

const emptyListener = (): void => {}
const listener2Unique = (): void => {}

test('register should return a number ID', () => {
  const id = Listener.register(emptyListener)
  expect(typeof id).toBe('number')
  expect(id).toBeGreaterThan(0)
})

const testListener = (): string => {
  return 'test'
}

test('register should store the listener in state', () => {
  const id = Listener.register(testListener)
  expect(Listener.state[id]).toBe(testListener)
})

test('execute should call the registered listener with arguments', () => {
  let calledWith: ReadonlyArray<any> = []
  const argsListener = (...args: ReadonlyArray<any>): void => {
    calledWith = args
  }
  const id = Listener.register(argsListener)
  Listener.execute(id, 'arg1', 'arg2', 123)
  expect(calledWith).toEqual(['arg1', 'arg2', 123])
})

const resultListener = (): string => {
  return 'test result'
}

test('execute should return the listener return value', () => {
  const id = Listener.register(resultListener)
  const result = Listener.execute(id)
  expect(result).toBe('test result')
})

test('execute should return undefined when listener is not found', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const result = Listener.execute(99_999)
  expect(result).toBeUndefined()
  warnSpy.mockRestore()
})

test('execute should throw when id is not a number', () => {
  expect(() => {
    Listener.execute('not a number' as any)
  }).toThrow()
})

test('unregister should remove the listener from state', () => {
  const id = Listener.register(emptyListener)
  expect(Listener.state[id]).toBe(emptyListener)
  Listener.unregister(id)
  expect(Listener.state[id]).toBeUndefined()
})

test('multiple listeners should work independently', () => {
  let listener1Called = false
  let listener2Called = false
  const listener1 = (): void => {
    listener1Called = true
  }
  const listener2 = (): void => {
    listener2Called = true
  }
  const id1 = Listener.register(listener1)
  const id2 = Listener.register(listener2)
  Listener.execute(id1)
  expect(listener1Called).toBe(true)
  expect(listener2Called).toBe(false)
  Listener.execute(id2)
  expect(listener2Called).toBe(true)
})

const listener1String = (): string => {
  return 'listener1'
}
const listener2String = (): string => {
  return 'listener2'
}

test('unregister should not affect other listeners', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const id1 = Listener.register(listener1String)
  const id2 = Listener.register(listener2String)
  Listener.unregister(id1)
  const result = Listener.execute(id2)
  expect(result).toBe('listener2')
  expect(Listener.execute(id1)).toBeUndefined()
  warnSpy.mockRestore()
})

test('register should return unique IDs', () => {
  const id1 = Listener.register(emptyListener)
  const id2 = Listener.register(listener2Unique)
  expect(id1).not.toBe(id2)
})

test('execute should pass multiple arguments correctly', () => {
  let receivedArgs: ReadonlyArray<any> = []
  const multiArgListener = (a: string, b: number, c: boolean): void => {
    receivedArgs = [a, b, c]
  }
  const id = Listener.register(multiArgListener)
  Listener.execute(id, 'hello', 42, true)
  expect(receivedArgs).toEqual(['hello', 42, true])
})
