import './App.css'
import Leftside from './components/Leftside.tsx'
import Upgrade from './components/Upgrade.tsx'

function App() {
  return (
    <>
      <Leftside />
      <Upgrade 
        id={'#1'}/>
    </>
  )
}

export default App