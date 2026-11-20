import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import Upgrade from "./Upgrade.tsx"
import { Upgrades } from "../scripts/upgrades.tsx"

function Row({ children, className }: {
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
      w-[1000px] my-[20px] z-2
      ">
      <Upgrade id={'#1'} />
      <Upgrade className="mt-[50px] mr-[100px]" id={'#2'} />
    </div>
  )
}

type Line = { key: string; x1: number; y1: number; x2: number; y2: number }

function Paths() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [lines, setLines] = useState<Line[]>([])

  useLayoutEffect(() => {
    // the svg's own ref is attached before this effect runs
    const container = svgRef.current?.parentElement
    if (!container) {console.log('hi'); return}

    const EXTEND = 60
    const compute = () => {
      const origin = container.getBoundingClientRect()
      const next: Line[] = []

      for (const upgId in Upgrades) {
        const from = document.getElementById(upgId)
        if (!from) {
          console.warn("Paths - no element with id:", upgId)
          continue
        }
        const f = from.getBoundingClientRect()

        Upgrades[upgId].Unlocks.forEach(id => {
          const to = document.getElementById(id)
          if (!to) {
            console.warn("Paths - no element with id: ", id, "unlocked by:", upgId)
            return
          }
          const t = to.getBoundingClientRect()

          next.push({
            key: `${upgId}->${id}`,
            x1: f.left + f.width / 2 - origin.left,
            y1: f.bottom - origin.top - EXTEND,
            x2: t.left + t.width / 2 - origin.left,
            y2: t.top - origin.top + EXTEND,
          })
        })
      }
      setLines(next)
    }

    // const ro = new ResizeObserver(compute)
    // ro.observe(container)
    // for (const upgId in Upgrades) {
    //   const el = document.getElementById(upgId)
    //   if (el) ro.observe(el)
    // } !! need something better

    compute()
    // return () => ro.disconnect()
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-[100%] h-[100%] z-0 overflow-visible pointer-event-none"
    >
      {lines.map(l => (
        <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="gray" strokeWidth="5" />
      ))}
    </svg>
  )
}

function Middle() {
  return (
    <div className="flex flex-column relative">
      <Basic />
      <Paths />
    </div>
  )
}

export default Middle