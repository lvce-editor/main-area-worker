import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'

test('gets and sets the live component state', async () => {
  const uid = 101
  const oldState = { ...createDefaultState(), tabHeight: 35, uid }
  const newState = { ...oldState, tabHeight: 41 }
  MainAreaStates.set(uid, oldState, oldState)

  expect(getComponentState(uid)).toBe(oldState)
  await setComponentState(uid, newState)

  expect(MainAreaStates.get(uid)).toEqual({ newState, oldState, scheduledState: newState })
})

test('preserves non-finite limits after a JSON round trip', async () => {
  const uid = 103
  const oldState = { ...createDefaultState(), uid }
  const json = JSON.stringify({ ...oldState, tabHeight: 41 })
  const jsonState = JSON.parse(json)
  MainAreaStates.set(uid, oldState, oldState)

  await setComponentState(uid, jsonState)

  expect(getComponentState(uid)).toMatchObject({
    maxOpenEditorGroups: Infinity,
    maxOpenEditors: Infinity,
    tabHeight: 41,
  })
})

test('sets component state while a serial command is running', async () => {
  const uid = 104
  const oldState = { ...createDefaultState(), tabHeight: 35, uid }
  const newState = { ...oldState, tabHeight: 41 }
  MainAreaStates.set(uid, oldState, oldState)

  const { promise, resolve } = Promise.withResolvers<void>()
  const command = MainAreaStates.wrapSerialCommand(async (state) => {
    await promise
    return MainAreaStates.get(uid).newState
  })
  const runningCommand = command(uid)
  await Promise.resolve()
  const settingState = setComponentState(uid, newState)

  try {
    const waitForSettingState = async (): Promise<true> => {
      await settingState
      return true
    }
    const completedWithoutWaitingForTheSerialCommand = await Promise.race([
      waitForSettingState(),
      new Promise<false>((resolveTimeout) => setTimeout(resolveTimeout, 100, false)),
    ])
    expect(completedWithoutWaitingForTheSerialCommand).toBe(true)
    expect(getComponentState(uid)).toMatchObject({ tabHeight: 41 })
  } finally {
    resolve()
    await Promise.all([runningCommand, settingState])
  }
})

test('rejects an invalid live component state', async () => {
  const uid = 102
  const state = { ...createDefaultState(), uid }
  MainAreaStates.set(uid, state, state)

  await expect(setComponentState(uid, { ...state, uid: 103 })).rejects.toThrow('Main Area state uid must remain 102')
  await expect(setComponentState(uid, [] as unknown)).rejects.toThrow('Main Area state must be an object')
})
