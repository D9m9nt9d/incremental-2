import { Fragment, useState } from 'react'
import { BoughtUpgrades, buyUpgrade, Upgrades } from '../scripts/upgrades.tsx'
import Currency from './Currency.tsx'
import { formatCurrency, type CurrencyName } from '../scripts/currencies'

function Upgrade({ id, className }: {
  id: string, className?: string
}) {
  const [level, setLevel] = useState(BoughtUpgrades[id] || 0)

  const upgInfo = Upgrades[id]
  upgInfo.setState = setLevel

  const lvls = upgInfo.Levels
  let lvlInfo = lvls[level]

  const Maxed = !lvlInfo
  if (Maxed) lvlInfo = lvls[level - 1]

  function onClick() {
    const [success, reason] = buyUpgrade(id)
    if (!success) {
      console.warn(reason)
    } else {
      console.log('success')
    }
  }

  let cost = null
  if (Maxed) {
    cost = ''
  } else if (lvlInfo.CostLabel) {
    cost = lvlInfo.CostLabel
  } else if (lvlInfo.Cost) {
    cost = []
    const divider = ', '
    const keys = Object.keys(lvlInfo.Cost) as CurrencyName[]
    const lastKey = keys[keys.length - 1]

    for (const key in lvlInfo.Cost) {
      const currency = key as CurrencyName
      const needed = lvlInfo.Cost[currency]!
      cost.push(
        <Fragment key={currency}>
          <Currency id={currency} text={formatCurrency(needed) + (currency !== lastKey ? divider : '')} />
        </Fragment>
      )
    }
  }

  return (
    <div id={id} className={'w-[260px] h-fit rounded-md bg-gray-200 border-3 border-gray-300 ' + (className ? className : '')}>
      <div className='py-1 px-2 flex flex-row justify-between'>
        <div className=''>{id}</div>
        <div className='p'>{upgInfo.Label}</div>
      </div>
      <div className='text-center h-[78px] bg-gray-300/50
        overflow-y-auto scrollbar-thin scrollbar-gutter-both scrollbar-track-transparent
        transition-all transition-discrete duration-200 ease-in-out
        scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300
        flex content-center-safe justify-center-safe
        flex-row flex-wrap whitespace-pre-wrap
        '>
        {lvlInfo.Description}
      </div>
      <div className={'py-1 px-2 flex flex-row justify-between select-none ' + (Maxed ? '' : 'cursor-pointer')}
        onClick={onClick}>
        <div className='flex flex-row flex-wrap'>{cost}</div>
        <div>{Maxed ? 'Maxed!' : `${level}/${lvls.length}`}</div>
      </div>
    </div>
  )
}

export default Upgrade