import { useState } from 'react'
import { BoughtUpgrades, buyUpgrade, Upgrades } from '../scripts/upgrades'
import './Upgrade.css'

function Upgrade({ id }: {
  id: string
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

  return (
    <div className='w-[260px] rounded-md bg-gray-200 border-3 border-gray-300'>
      <div className='py-1 px-2 flex flex-row justify-between'>
        <div className=''>{id}</div>
        <div className='p'>{upgInfo.Label}</div>
      </div>
      <div className='text-center h-[78px] bg-gray-300/50
        overflow-y-auto scrollbar-thin scrollbar-gutter-both scrollbar-track-transparent
        transition-all transition-discrete duration-200 ease-in-out
        scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300
        flex place-items-center-safe justify-center-safe
        '>
        {lvlInfo.Description}
      </div>
      <div className={'py-1 px-2 flex flex-row justify-between '+ (Maxed ? '' : 'cursor-pointer')}
        onClick={onClick}>
        <div>{Maxed ? '' : lvlInfo.CostLabel}</div>
        <div>{Maxed ? 'Maxed!' : `${level}/${lvls.length}`}</div>
      </div>
    </div>
  )
}

export default Upgrade