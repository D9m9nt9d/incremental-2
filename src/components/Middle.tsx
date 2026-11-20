import type { ReactNode } from "react"
import Upgrade from "./Upgrade.tsx"

function Row({ children, className } : {
  children?: ReactNode, className?: string
}) {
  return (
    <div className={"flex flex-row " + (className ? className : '')}>{children}</div>
  )
}

function Basic() {
  return (
    <div className="
      flex flex-col flex-wrap items-center
      w-[1000px] my-[20px]
      ">
      <Upgrade id={'#1'} />
      <Row className="w-[100%] mt-[20px]">
        <Upgrade className="mt-[0px]" id={'#1'} />
        <Upgrade className="ml-[20px]" id={'#1'} />
      </Row>
      <Upgrade className="mt-[20px]" id={'#2'} />
    </div>
  )
}

function Middle() {
  return (
    <div className="flex flex-column">
      <Basic />
    </div>
  )
}

export default Middle