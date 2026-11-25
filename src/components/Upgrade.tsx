import { Fragment, useState } from 'react'
import { type UpgradeState, buyUpgrade, getLevel, Upgrades } from '../scripts/upgrades.tsx'
import Currency from './Currency.tsx'
import { formatCurrency, type CurrencyName } from '../scripts/currencies'

function Upgrade({ id, className, style }: {
  id: string, className?: string, style?: ''
}) {
  if (!Upgrades[id]) {
    console.warn('Invalid upgrade id - ' + id)
    return
  }

  const [level, setLevel] = useState<UpgradeState>(getLevel(id))

  if (level === 'refresh') {
    setLevel(getLevel(id))
    return
  }

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

  function onRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    let [success] = buyUpgrade(id)
    while (success) [success] = buyUpgrade(id)
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

  if (!style) {
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
          {lvlInfo.Description || upgInfo.FallbackDescription}
        </div>
        <div className={'py-1 px-2 flex flex-row justify-between select-none ' + (Maxed ? '' : 'cursor-pointer')}
          onClick={onClick} onContextMenu={onRightClick}>
          <div className='flex flex-row flex-wrap'>{cost}</div>
          <div>{Maxed ? 'Maxed!' : `${level}/${lvls.length}`}</div>
        </div>
      </div>
    )
  } else if (style === '') {
    
  } else {
    console.warn('Invalid upgrade style - ' + style)
  }
}

export default Upgrade