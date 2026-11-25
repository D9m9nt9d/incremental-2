import type { ReactNode } from "react"

function Row({ children, className }: {
  children?: ReactNode, className?: string
}) {
  return (
    <div className={"flex flex-row " + (className ? className : '')}>{children}</div>
  )
}

export default Row