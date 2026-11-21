import { Decimal as D } from "decimal.js"
import { addBase, addCurrency, Currencies, setCurrency, type CurrencyName } from "./currencies.ts"
import { useState, type ReactNode } from "react"
import Currency from "../components/Currency.tsx"

type Cost = Partial<Record<CurrencyName, D.Value>>
type Check = () => true | string
type OnBought = (loaded: boolean, level: number) => void
type UpgradeState = number | 'refresh'

interface UpgradeLevel {
  Description: ReactNode
  OnBought: OnBought
  Cost?: Cost
  Check?: Check
  CostLabel?: ReactNode
}

type UpgradeItem = {
  Label: string
  Levels: UpgradeLevel[]
  Requirements: string[]
  Unlocks: string[]
  LoadPriority: number
  setState?: (level: UpgradeState) => void
}

function level({ Description, Cost, Check, CostLabel, OnBought }: {
  Description: ReactNode
  Cost?: Cost
  Check?: Check
  CostLabel?: ReactNode
  OnBought: OnBought
}) {
  return {
    Description: Description,
    OnBought: OnBought,
    Cost: Cost,
    Check: Check,
    CostLabel: CostLabel
  } as UpgradeLevel
}

function levels(amount: number, { Description, Cost, Check, CostLabel, OnBought }: {
  Description: (level: number) => ReactNode
  Cost?: (level: number) => Cost
  Check?: (level: number) => Check,
  CostLabel?: (level: number) => ReactNode
  OnBought: (level: number) => OnBought
}) {
  const lvls = []

  for (let i = 1; i <= amount; i++) {
    lvls.push({
      Description: Description(i),
      OnBought: OnBought(i),
      Cost: Cost?.(i),
      Check: Check?.(i),
      CostLabel: CostLabel?.(i)
    } as UpgradeLevel)
  }

  return lvls
}

// Different fonts have different letter heights so basic font -> currency with cursive (for example) -> basic font looks ugly 
// First levels index is 0 but it sends parameter 1

const Upgrades: { [key: string]: UpgradeItem } = {
  '#1': {
    Label: 'The grand start',
    Levels: [
      level({
        Description: <>Start generating&#8201;<Currency id='Money' text="0.0001" /> per second</>,
        CostLabel: 'Free!', Check: () => true,
        OnBought: () => {
          addBase('Money', 0.0001)
          setInterval(() => addCurrency('Money'), 1000);
        },
      }),
      level({
        Description: <>Plus&#8201;<Currency id='Money' text="1K" /> base</>,
        Cost: { "Money": 1000, "Gems": 100, "Crystals": 10 },
        OnBought: () => addBase('Money', 1000)
      })
    ],
    LoadPriority: 1,
    Requirements: [], Unlocks: [],
  },
  '#2': {
    Label: 'The repetition',
    Levels: [
      ...levels(5, {
        Description: (i) => <>Plus&#8201;<Currency id="Money" text={String(i / 10000)} /> base.</>,
        Cost: (i) => { return { 'Money': (i * i * 1.5 / 10000) } },
        OnBought: (_) => (_, level) => addBase('Money', level / 10000)
      })
    ],
    LoadPriority: 1,
    Requirements: ['#1'], Unlocks: [],
  },
  '#3': {
    Label: 'Repetition of repetition',
    Levels: [
      ...levels(3, {
        Description: (_) => `Plus 5 levels to #2.`,
        Cost: (i) => { return { 'Money': (i * i * i * i * i / 1000) } },
        OnBought: (_) => (_) => {
          const length = Upgrades['#2'].Levels.length
          Upgrades['#2'].Levels = [
            ...Upgrades['#2'].Levels,
            ...levels(5, {
              Description: (i) => {
                i += length;
                return <>Plus&#8201;<Currency id="Money" text={String(i / 10000)} /> base.</>
              },
              Cost: (i) => {
                i += length;
                return { 'Money': D(i * i * 2 / 10000) }
              },
              OnBought: (_) => (_, level) => addBase('Money', level / 10000)
            })
          ]
          Upgrades['#2'].setState?.('refresh')
        }
      })
    ],
    LoadPriority: 5,
    Requirements: ['#2'], Unlocks: [],
  },
  '#4': {
    Label: '',
    Levels: [
      level({
        Description: <>Plus&#8201;<Currency id="Money" text="0.0089" /> base</>,
        Cost: { 'Money': 0.05 },
        OnBought: () => addBase('Money', 0.0089)
      })
    ],
    LoadPriority: 1,
    Requirements: ['#2'], Unlocks: [],
  },
  '#5': {
    Label: '',
    Levels: [
      level({
        Description: <>Unlock money boosting machine</>,
        Cost: { 'Money': 0.6 },
        OnBought: () => setGameState('HasBoostMachine', true)
      })
    ],
    LoadPriority: 1,
    Requirements: ['#4'], Unlocks: [],
  },
} // 0.03

const defaultValues: { [key: string]: any } = {
  'HasBoostMachine': false
}

// Game states
// Why not default useStates: i don't like how you have to use them inside elements, this will be easier to use

const gameStates: { [key: string]: {
  setState?: any
  value: any
} } = {}

function useGameState(name: string) {
  const [state, setState] = useState(getGameState(name))
  gameStates[name].setState = setState
  return [state, setState]
}

function setGameState(key: string, value: any) {
  const state = gameStates[key] || {}
  state.setState?.(value)
  state.value = value
  gameStates[key] = state
}

function getGameState(key: string) {
  const state = gameStates[key]
  if (!state) {
    const value = defaultValues[key]
    gameStates[key] = {value: value}
    return value
  } else {
    return state.value
  }
}

// Fill unlocks
for (const upgId in Upgrades) {
  Upgrades[upgId].Requirements.forEach(id => Upgrades[id].Unlocks.push(upgId))
} 
// console.log(Upgrades)

const BoughtUpgrades: { [key: string]: number } = {
  // '#1': 2,
  // '#2': 13,
  // '#3': 1,
}

// Functions

function getLevel(id: string) {
  return BoughtUpgrades[id] || 0
}

function buyUpgrade(id: string) {
  const upgInfo = Upgrades[id]
  let level = getLevel(id)

  const lvls = upgInfo.Levels
  const lvlInfo = lvls[level]

  const Maxed = !lvlInfo
  if (Maxed) return [false, 'Upgrade is at max level']

  if (lvlInfo.Check) {
    const reason = lvlInfo.Check()
    if (reason != true) return [false, reason]
  }

  if (lvlInfo.Cost) {
    for (const key in lvlInfo.Cost) {
      const currency = key as CurrencyName
      const needed = lvlInfo.Cost[currency]!
      if (Currencies[currency].Value.lessThan(needed)) return [false, `Not enough ${currency}`]
    }

    for (const key in lvlInfo.Cost) {
      const currency = key as CurrencyName
      const needed = lvlInfo.Cost[currency]!
      setCurrency(currency, Currencies[currency].Value.minus(needed))
    }
  }

  level += 1
  BoughtUpgrades[id] = level
  localStorage.setItem('boughtUpgrades', JSON.stringify(BoughtUpgrades))
  upgInfo.setState?.(level)
  try { lvlInfo.OnBought(false, level) }
  catch (e) {
    console.warn(`buyUpgrade - id: ${id}, lvl: ${level}, error: See below`)
    console.error(e)
  }

  return [true, 'Success']
}

function loadUpgrade(id: string, level: number) {
  const upgInfo = Upgrades[id]
  const lvls = upgInfo.Levels

  // console.log(id, level)
  // console.log(upgInfo)
  // console.log(lvls)

  for (let i = 0; i <= level - 1; i++) {
    // console.log(i)
    try { lvls[i].OnBought(true, i + 1) }
    catch (e) {
      console.warn(`loadUpgrade - id: ${id}, lvl: ${level}, error: See below`)
      console.error(e)
    }
  }

  upgInfo.setState?.(level)
}

// Init

const savedUnparsed = localStorage.getItem('boughtUpgrades')
if (savedUnparsed) {
  const saved = JSON.parse(savedUnparsed)
  for (const id in saved) {
    BoughtUpgrades[id] = saved[id]
  }
}

const sorted = Object.entries(BoughtUpgrades).sort(
  ([a], [b]) => Upgrades[b].LoadPriority - Upgrades[a].LoadPriority
)

for (const [id, lvl] of sorted) {
  loadUpgrade(id, lvl)
}

export {
  Upgrades, BoughtUpgrades, useGameState,
  buyUpgrade, loadUpgrade, getLevel,
  type UpgradeItem, type UpgradeState
}