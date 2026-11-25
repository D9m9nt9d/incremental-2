import { useLayoutEffect, useRef } from "react"
import { Upgrades } from "../scripts/upgrades.tsx"
import Basic from "./Basic.tsx"

function Middle() {
  return (
    <div className="flex flex-column relative">
      <Basic />
      <Paths />
    </div>
  )
}

export default Middle



const EDGES = Object.entries(Upgrades).flatMap(([from, u]) =>
  u.Unlocks.map(to => ({ key: `${from}->${to}`, from, to }))
)

function Paths() {
  const svgRef = useRef<SVGSVGElement>(null)
  const lineRefs = useRef(new Map<string, SVGLineElement>())

  useLayoutEffect(() => {
    const container = svgRef.current?.parentElement
    if (!container) return

    const EXTEND = 60
    const observed = new Set<Element>()

    const track = (el: Element) => {
      if (!observed.has(el)) {
        observed.add(el)
        ro.observe(el)
      }
    }

    const compute = () => {
      const origin = container.getBoundingClientRect()

      for (const { key, from, to } of EDGES) {
        const line = lineRefs.current.get(key)
        if (!line) continue

        const a = document.getElementById(from)
        const b = document.getElementById(to)
        if (!a || !b) {
          line.setAttribute('visibility', 'hidden') // if upgrade not mounted
          continue
        }
        track(a)
        track(b)

        const f = a.getBoundingClientRect()
        const t = b.getBoundingClientRect()

        line.setAttribute('x1', String(f.left + f.width / 2 - origin.left))
        line.setAttribute('y1', String(f.bottom - origin.top - EXTEND))
        line.setAttribute('x2', String(t.left + t.width / 2 - origin.left))
        line.setAttribute('y2', String(t.top - origin.top + EXTEND))
        line.setAttribute('visibility', 'visible')
      }
    }

    const ro = new ResizeObserver(compute)
    ro.observe(container)

    // elements mounting/unmounting, class/style changes
    const mo = new MutationObserver(compute)
    mo.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    compute()
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full z-0 overflow-visible pointer-events-none"
    >
      {EDGES.map(({ key }) => (
        <line
          key={key}
          ref={el => {
            if (el) lineRefs.current.set(key, el)
            else lineRefs.current.delete(key)
          }}
          visibility="hidden"
          stroke="gray"
          strokeWidth="5"
        />
      ))}
    </svg>
  )
}

// useEffect(() => {
//     const old = document.getElementById(id + 'SVG')
//     if (old) old.remove()

//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
//     svg.id = id + 'SVG'
//     svg.classList.add("absolute")
//     svg.classList.add("top-0")
//     svg.classList.add("left-0")
//     svg.classList.add("w-full")
//     svg.classList.add("h-full")
//     svg.classList.add("z-0")
//     svg.classList.add("overflow-visible")
//     svg.classList.add("pointer-events-none")
//     document.body.append(svg)

//     const EXTEND = 60

//     const origin = svg.getBoundingClientRect()
//     type Line = { key: string; x1: number; y1: number; x2: number; y2: number }
//     const next: Line[] = []

//     const from = document.getElementById(id)
//     if (!from) {
//       console.warn("Paths - no element with id:", id)
//       return
//     }
//     const f = from.getBoundingClientRect()

//     Upgrades[id].Unlocks.forEach(otherId => {
//       const to = document.getElementById(otherId)
//       if (!to) {
//         console.warn("Paths - no element with id: ", otherId, "unlocked by:", id)
//         return
//       }
//       const t = to.getBoundingClientRect()

//       next.push({
//         key: `${id}->${otherId}`,
//         x1: f.left + f.width / 2 - origin.left,
//         y1: f.bottom - origin.top - EXTEND,
//         x2: t.left + t.width / 2 - origin.left,
//         y2: t.top - origin.top + EXTEND,
//       })
//     })

//     next.forEach(l => {
//       const el = document.createElementNS('http://www.w3.org/2000/svg', 'line')
//       el.setAttribute('x1', String(l.x1))
//       el.setAttribute('y1', String(l.y1))
//       el.setAttribute('x2', String(l.x2))
//       el.setAttribute('y2', String(l.y2))
//       el.setAttribute('stroke', 'gray')
//       el.setAttribute('stroke-width', '5')
//       svg.append(el)
//     })
//   })