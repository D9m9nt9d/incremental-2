import { setGameState, useGameState } from "../scripts/gameStates.ts"
import Upgrade from "./Upgrade.tsx"
import Row from "./Row.tsx"
import Bar from "./Bar.tsx"

import crystalsIcon from '/src/assets/images/crystal.svg'
import crystalsCave from '/src/assets/images/crystalcave.webp'
import { removeFromArray } from "../scripts/utils.ts"
import { addCurrency } from "../scripts/currencies.ts"
import Decimal from "decimal.js"

function MoneyBoostingMachine() {
  const percentage = useGameState('BMBpercents')
  const multiplier = useGameState('BMBmulti')

  function onClick() {
    setGameState('BMBpercents', (prev: any) => Math.min(prev + 7, 100))
  }

  return (
    <div id="MoneyBooster" className="w-72 flex flex-col gap-3 p-4 border-3
    border-gray-300 bg-gray-200 font-medium">
      <div className="flex items-end justify-between">
        <span>Money boost:</span>
        <span className="text-2xl tabular-nums">
          {multiplier.toFixed(2)}x
        </span>
      </div>

      <Bar percent={percentage} />

      <button
        onClick={onClick}
        className="select-none border-3 border-gray-400 bg-gray-200 py-2 font-semibold
        hover:bg-gray-300 active:translate-y-[1px] active:shadow-none">
        Click to boost
      </button>
    </div>
  )
}

function CrystalMine() {
  const crystals: crystal[] = useGameState('Crystals')

  type crystal = {
    x: number,
    y: number,
    rotate: number,
    bright: number,
    hue: number,
    size: number
  }

  function onHover(index: number) {
    addCurrency('Crystals', Decimal(1))
    setGameState('Crystals', (prev: any) => removeFromArray(prev, index))
  }

  return (
    <div id="CrystalMine" className="w-140 h-100 mt-20 mb-5 relative flex flex-wrap place-content-center">
      <img src={crystalsCave} className="w-180 max-w-max h-140 mr-5 mt-2"/>
      {crystals.map((info, index) => {
        return (
          <img key={index} src={crystalsIcon} className="w-10 h-10 absolute p-1"
            style={{
              left: `${info.x}%`, top: `${info.y}%`,
              transform: `translate(-50%, -50%) rotate(${info.rotate}deg) scale(${info.size})`,
              filter: `brightness(${info.bright}%) hue-rotate(${info.hue}deg)`
            }}
            onMouseOver={() => onHover(index)}
          />
        )
      })}
    </div>
  )
}

function Basic() {
  const hasBoostMachine = useGameState('HasMBM')
  const hasCrystalMine = useGameState('HasCM')

  return (
    <div className="
      flex flex-col flex-wrap items-center
      w-500 px-55 my-6 z-2
      font-[montserrat]
      ">
      <Upgrade id='#1' />
      <Upgrade className="mt-12 mr-24" id='#2' />
      <Row className="mt-12">
        <Upgrade className="mr-3" id='#3' />
        <Upgrade className="ml-12" id='#4' />
      </Row>
      <Row className="mt-12">
        <Upgrade className="mt-2 mr-12" id='#5' />
        {hasBoostMachine && <MoneyBoostingMachine />}
      </Row>
      <Row className="mt-15">
        <Upgrade className="" id='#6' />
        <Upgrade className="mx-5" id='#7' />
        <Upgrade className="" id='#8' />
      </Row>
      <Upgrade className="mt-12 ml-80" id='#9' />
      <Upgrade className="mt-12 ml-30" id='#10' />
      <Upgrade className="mt-15" id="#11" />
      {hasCrystalMine && <CrystalMine />}
      <Upgrade className="mt-15" id="#12" />
      <Row className="mt-15">
        <Upgrade className="" id='#13' />
        <Upgrade className="mx-5" id='#14' />
      </Row>
    </div>
  )
}

export default Basic