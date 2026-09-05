import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

test('keeps compatibility with renderer versions without assigned ranges', async () => {
  const Id = await import('../src/parts/Id/Id.ts')
  const random = jest.spyOn(Math, 'random').mockReturnValue(0.25)
  try {
    expect(Id.create()).toBe(0.25)
  } finally {
    random.mockRestore()
  }
})

test('allocates only within the assigned range and never wraps on exhaustion', async () => {
  const Id = await import('../src/parts/Id/Id.ts')
  Id.configure(100, 102)
  expect([Id.create(), Id.create(), Id.create()]).toEqual([100, 101, 102])
  expect(() => Id.create()).toThrow('range exhausted')
  expect(() => Id.create()).toThrow('range exhausted')
})

test('cannot reset an allocator and reuse component ids', async () => {
  const Id = await import('../src/parts/Id/Id.ts')
  Id.configure(100, 102)
  expect(Id.create()).toBe(100)
  expect(() => Id.configure(100, 102)).toThrow('already configured')
  expect(Id.create()).toBe(101)
})

test.each([
  [0, 1],
  [-1, 1],
  [1, 0],
  [0.5, 2],
  [1, Infinity],
  [NaN, 2],
  [1, Number.MAX_SAFE_INTEGER + 1],
])('rejects invalid range %s..%s without changing allocation state', async (start, end) => {
  const Id = await import('../src/parts/Id/Id.ts')
  expect(() => Id.configure(start, end)).toThrow('Invalid component id range')
  Id.configure(1, 1)
  expect(Id.create()).toBe(1)
})

test('supports the last safe integer without returning an unsafe id', async () => {
  const Id = await import('../src/parts/Id/Id.ts')
  Id.configure(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  expect(Id.create()).toBe(Number.MAX_SAFE_INTEGER)
  expect(() => Id.create()).toThrow('range exhausted')
})
