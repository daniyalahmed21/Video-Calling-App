import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Room from './pages/Room'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/room/:id' element={<Room />} />
    </Routes>
  )
}

export default App