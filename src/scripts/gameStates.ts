import { useState } from "react"
import { changeMulti } from "./currencies"

// Game states
// Why not default useStates: i don't like how you have to use them inside elements, this will be easier to use

// useGameState = react elements
// getGameState = scripts
// setGameState = both

type GameStateName = keyof typeof gameStates
type GameStateItem = {
  value: any
  onChanged?: (cur: any) => void
  setState?: (prev: any) => void
}

function defineGameStates<K extends string>(states: Record<K, GameStateItem>) {
  return states
}

const gameStates = defineGameStates({
  Pinned: { value: {} },

  HasMBM: { value: false },
  BMBpercents: {
    value: 0,
    onChanged(value) { setGameState('BMBmulti', 1 + value / 100 * 4) }
  },
  BMBmulti: {
    value: 1,
    onChanged(value) { changeMulti('Money', 'MoneyBoostingMachine', value) }
  },
  BMBminus: { value: 1 },

  HasCM: { value: false },
  Crystals: { value: [] },
})

function useGameState(name: GameStateName) {
  const [state, setState] = useState(getGameState(name))
  gameStates[name].setState = setState
  return state
}

type Updater<T> = T | ((prev: T) => T)

function setGameState(key: GameStateName, value: Updater<any>) {
  const state = gameStates[key]
  const next = typeof value === 'function' ? value(state.value) : value
  state.value = next
  state.setState?.(() => next)
  state.onChanged?.(next)
}

function getGameState(key: GameStateName) {
  return gameStates[key].value
}

export {
  gameStates, useGameState,
  getGameState, setGameState,
}