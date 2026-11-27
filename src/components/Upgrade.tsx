import { Fragment, useState } from 'react'
import { confetti } from "@tsparticles/confetti";
import { type UpgradeState, buyUpgrade, getLevel, Upgrades } from '../scripts/upgrades.tsx'
import { Currencies, formatCurrency, type CurrencyName } from '../scripts/currencies'
import Currency from './Currency.tsx'
import { random } from '../scripts/utils.ts';

let confettiContainer: Awaited<ReturnType<typeof confetti>>
let lastScrollX = window.scrollX
let lastScrollY = window.scrollY

window.addEventListener('scroll', () => {
  const dx = window.scrollX - lastScrollX
  const dy = window.scrollY - lastScrollY
  lastScrollX = window.scrollX
  lastScrollY = window.scrollY

  const container = confettiContainer
  if (!container || container.destroyed) return

  // particle positions use canvas pixels, so scale by the pixel ratio
  const ratio = container.retina.pixelRatio
  for (const p of container.particles.filter(() => true)) {
    p.position.x -= dx * ratio
    p.position.y -= dy * ratio
  }
}, { passive: true })

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

  const particleColors = ["#e7e9ec", "#d3d8e0", "#acb5c2"]

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
      particleColors.push(Currencies[currency].ParticleColor)
    }
  }

  function doParticles(e: React.MouseEvent<HTMLDivElement>, amount: number) {
    let { clientX: x, clientY: y } = e;

    // keyboard clicks have no mouse position, use button center just in case
    if (e.type === 'click' && e.detail === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    confetti({
      position: {
        x: (x / window.innerWidth) * 100,
        y: (y / window.innerHeight) * 100,
      },
      spread: 360,
      count: amount,
      startVelocity: 10,
      gravity: 1,
      decay: 0.9,
      ticks: 60,
      scalar: 0.7,
      shapes: ["circle"],
      colors: particleColors,
      flat: true,
      disableForReducedMotion: false,
    }).then(container => { confettiContainer = container });
  }

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const [success, reason] = buyUpgrade(id)
    if (!success) {
      console.warn(reason)
    } else {
      console.log('success')
    }
    doParticles(e, success ? 40 : random(3, 6))
  }

  function onRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    let i = 0
    while (buyUpgrade(id)[0]) i++
    doParticles(e, Math.min(random(3, 6) + i * 35, 250))
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