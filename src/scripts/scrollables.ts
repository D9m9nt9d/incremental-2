import { getGameState, setGameState } from "./gameStates";

type ScrollableName = keyof typeof scrollables;
type ScrollableItem = {
  display: string,
  index: number,
}

type Pinned = Partial<Record<ScrollableName, boolean>>

const scrollables = {
  MoneyBooster: {
    display: 'Money boosting machine',
    index: 0
  },
  MoneyBooster3: {
    display: 'Money 3boosting machine',
    index: 2
  },
  MoneyBooster2: {
    display: 'Money 2boosting machine',
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
  type Pinned, type ScrollableName,
}