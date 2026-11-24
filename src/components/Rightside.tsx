import { useState } from "react";
import { useGameState } from "../scripts/gameStates";
import { scrollables, setPin, type Pinned, type ScrollableName } from "../scripts/scrollables";

function Scrollables({ pinned, editing }: {
  pinned: Pinned
  editing: boolean
}) {
  const toDisplay = []

  if (editing) {
    for (const name in pinned) {
      const key = name as ScrollableName
      const info = scrollables[key]
      const value = pinned[key]

      toDisplay.push(
        <div key={key} style={{ order: info.index }}>
          <button className="bg-black text-white px-4 py-2"
            onClick={() => setPin(key, !value)}
          >Pin{value ? '+' : '-'}
          </button>
          <span>{info.display}</span>
        </div>
      )
    }
  } else {
    for (const name in pinned) {
      const key = name as ScrollableName
      if (pinned[key] != true) continue
      const info = scrollables[name as ScrollableName]

      function onClick() {
        document.getElementById(name)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }

      toDisplay.push(
        <div key={key} style={{ order: info.index }}>
          <button className="bg-black text-white px-4 py-2"
            onClick={onClick}
          >{info.display}
          </button>
        </div>
      )
    }
  }

  return (<div className="flex flex-col">
    {toDisplay}
  </div>)
}

function RightSide() {
  const pinned = useGameState('Pinned')
  const [editing, setEditing] = useState(false)

  return (
    <div className="fixed right-0 top-0 z-5">
      {(Object.keys(pinned).length > 0) &&
        <button
          className="bg-black text-white px-4 py-2"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Save' : 'Edit'}
        </button>}

      <Scrollables pinned={pinned} editing={editing} />
    </div>
  )
}

export default RightSide