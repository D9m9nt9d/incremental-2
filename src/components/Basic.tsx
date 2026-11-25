import { setGameState, useGameState } from "../scripts/gameStates.ts"
import Upgrade from "./Upgrade.tsx"
import Row from "./Row.tsx"
import Bar from "./Bar.tsx"

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

function Basic() {
  const hasBoostMachine = useGameState('HasMBM')

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
    </div>
  )
}

export default Basic