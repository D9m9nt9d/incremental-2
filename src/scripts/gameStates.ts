import { useState } from "react"
import { changeMulti } from "./currencies"
import { random, randomFloat } from "./utils"

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
  other?: any
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
  CSMax: { value: 5 },
  CSAmount: { value: 1 },
  CSTiming: { value: 5000,
    onChanged(value) {
      clearInterval(this.other)
      this.other = setInterval(() => {
        const current = getGameState('Crystals')
        const difference = getGameState('CSMax') - current.length
        if (difference <= 0) return
        
        const plus: any[] = []
        const toSpawn = Math.min(difference, getGameState('CSAmount'))
        for (let i = 1; i <= toSpawn; i++) plus.push(createRandomCrystal())
          
        setGameState('Crystals', (prev: any) => [...prev, ...plus])
      }, value)
    }
  },
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

function createRandomCrystal() {
  return {
    x: random(4, 96),
    y: random(5, 95),
    rotate: random(0, 359),
    bright: random(95, 105),
    hue: random(-10, 10),
    size: randomFloat(.9, 1.1)
  }
}