import { Decimal as D } from "decimal.js"
import { addCurrency, Currencies, setCurrency, type CurrencyName } from "./currencies.ts"
import type { ReactNode } from "react"
import Currency from "../components/Currency.tsx"

type Cost = Partial<Record<CurrencyName, D.Instance>>
type Check = () => true | string
type OnBought = (loaded: boolean, level: number) => void
type UpgradeState = number | 'refresh'

interface UpgradeLevel {
  Description: ReactNode
  OnBought: OnBought
  Cost?: Cost
  Check?: Check
  CostLabel?: string
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
  CostLabel?: string
  OnBought?: OnBought
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
  Description: (level: number) => string
  Cost?: (level: number) => Cost
  Check?: (level: number) => Check,
  CostLabel?: (level: number) => string
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
          Currencies.Money.Base = Currencies.Money.Base.plus(0.0001)
          setInterval(() => addCurrency('Money'), 1000);
        },
      }),
      level({
        Description: <><span className="font-[cursive]">Plus&#8201;</span><Currency id='Money' text="1K" /><span className="font-[cursive]"> base</span></>,
        Cost: { 'Money': D(1000), 'Gems': D(100), 'Crystals': D(10) },
        OnBought: () => Currencies.Money.Base = Currencies.Money.Base.plus(1000),
      })
    ],
    LoadPriority: 1,
    Requirements: [], Unlocks: [],
  },
  '#2': {
    Label: 'The repetition',
    Levels: [
      ...levels(10, {
        Description: (i) => `Plus ${i / 10000} money base.`,
        Cost: (i) => { return { 'Money': D(i * i / 10000) } },
        OnBought: (i) => (load, level) => { console.log(level); Currencies.Money.Base = Currencies.Money.Base.plus(level / 10000) }
      })
    ],
    LoadPriority: 1,
    Requirements: ['#1'], Unlocks: [],
  },
  '#3': {
    Label: 'This needs to stop',
    Levels: [
      ...levels(3, {
        Description: (i) => `Plus 5 levels to #2.`,
        Cost: (i) => { return { 'Money': D(i / 10000) } },
        OnBought: (i) => (load, level) => {
          Upgrades['#2'].Levels = [
            ...Upgrades['#2'].Levels,
            ...levels(5, {
              Description: (i) => `Plus ${i / 10000} money base.`,
              Cost: (i) => { return { 'Money': D(i * i / 10000) } },
              OnBought: (i) => (load, level) => { console.log(level); Currencies.Money.Base = Currencies.Money.Base.plus(level / 10000) }
            })
          ]
          Upgrades['#2'].setState?.('refresh')
        }
      })
    ],
    LoadPriority: 5,
    Requirements: ['#1'], Unlocks: [],
  },
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
    try { lvls[i].OnBought(true, i+1) }
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
  Upgrades, BoughtUpgrades,
  buyUpgrade, loadUpgrade, getLevel,
  type UpgradeItem, type UpgradeState
}