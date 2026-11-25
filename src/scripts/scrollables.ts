import { getGameState, setGameState } from "./gameStates";

type ScrollableName = keyof typeof scrollables;
type ScrollableItem = {
  className: string
  display: string
  index: number
}

type Pinned = Partial<Record<ScrollableName, boolean>>

const defaultStyle = 'font-[montserrat] font-medium text-amber-700 px-2 py-1'

const scrollables = {
  MoneyBooster: {
    className: defaultStyle,
    display: 'Money boosting machine',
    index: 0
  },
  ResearchCenter: {
    className: defaultStyle,
    display: 'Research center',
    index: 1
  },
} satisfies Record<string, ScrollableItem>;

function pinIfNotPinned(name: ScrollableName) {
  const pinned: Pinned = getGameState('Pinned')

  const wasntPinned = pinned[name] === undefined
  if (wasntPinned) setPin(name, true)
}

function deletePin(name: ScrollableName) {
  const pinned: Pinned = getGameState('Pinned')

  delete pinned[name]
  localStorage.setItem('pinned', JSON.stringify(pinned))
  setGameState('Pinned', { ...pinned })
}

function setPin(name: ScrollableName, value: boolean) {
  const pinned: Pinned = getGameState('Pinned')

  if (!scrollables[name]) {
    deletePin(name)
    return
  }

  pinned[name] = value
  localStorage.setItem('pinned', JSON.stringify(pinned))
  setGameState('Pinned', { ...pinned })
  
  if (value) console.log(name, 'was pinned')
  else console.log(name, 'was unpinned')
}

function loadSavedPins() {
  const savedUnparsed = localStorage.getItem('pinned')
  if (savedUnparsed) {
    const saved = JSON.parse(savedUnparsed)
    for (const id in saved) {
      setPin(id as ScrollableName, saved[id])
    }
  }
}

export {
  scrollables,
  pinIfNotPinned, setPin,
  loadSavedPins,
  type Pinned, 
  type ScrollableName,
  type ScrollableItem,
}