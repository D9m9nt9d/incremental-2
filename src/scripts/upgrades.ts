import Decimal from "decimal.js"
import { addCurrency, Currencies, setCurrency, type CurrencyName } from "./currencies.ts"

type Cost = Partial<Record<CurrencyName, Decimal.Instance>>
type Check = () => true | string

interface UpgradeLevel {
  Description: string
  OnBought: () => void
  OnLoad: () => void
  Cost?: Cost
  Check?: Check
  CostLabel?: string
  Requirements: string[]
  Unlocks: string[]
}

type UpgradeItem = {
  Label: string
  Levels: UpgradeLevel[]
  setState?: (level: number) => void
}

function level({ Description, Cost, Requirements, Check, CostLabel, OnBought, OnLoad }: {
  Description: string,
  Cost?: Cost, Requirements?: string[]
  Check?: Check, CostLabel?: string
  OnBought?: () => void
  OnLoad: () => void
}) {
  return {
    Description: Description,
    Cost: Cost,
    OnBought: OnBought || OnLoad,
    OnLoad: OnLoad,
    Requirements: Requirements || [],
    Unlocks: [],
    Check: Check,
    CostLabel: CostLabel,
  } as UpgradeLevel
}

const Upgrades: { [key: string]: UpgradeItem } = {
  '#1': {
    Label: 'The grand start',
    Levels: [
      level({
        Description: 'Start generating 0.0001 money per second.',
        Check: () => true,
        CostLabel: 'Free!',
        OnLoad: () => {
          Currencies.Money.Base = Currencies.Money.Base.plus(0.0001)
          setInterval(() => addCurrency('Money'), 1000);
        },
      }),
      level({
        Description: 'Plus 1 money base.',
        Cost: { 'Money': Decimal(0.0001), 'Gems': Decimal(0.0001), 'Crystals': Decimal(0.0001) },
        OnLoad: () => {
          Currencies.Money.Base = Currencies.Money.Base.plus(1)
        },
      }),
      level({
        Description: 'Plus 1000 money base.',
        Cost: { 'Money': Decimal(1) },
        OnLoad: () => {
          Currencies.Money.Base = Currencies.Money.Base.plus(1000)
        },
      }),
    ]
  }
}

const BoughtUpgrades: { [key: string]: number } = {
  // '#1': 2
}

function buyUpgrade(id: string) {
  const upgInfo = Upgrades[id]
  let level = BoughtUpgrades[id] || 0

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
  upgInfo.setState?.(level)
  try { lvlInfo.OnBought() }
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
    try { lvls[i].OnLoad() }
    catch (e) {
      console.warn(`loadUpgrade - id: ${id}, lvl: ${level}, error: See below`)
      console.error(e)
    }
  }

  upgInfo.setState?.(level)
}

for (const id in BoughtUpgrades) {
  const lvl = BoughtUpgrades[id]
  loadUpgrade(id, lvl)
}

export {
  Upgrades, BoughtUpgrades,
  buyUpgrade, loadUpgrade,
  type UpgradeItem
}