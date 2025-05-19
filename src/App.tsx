
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import RoomPage from './pages/RoomPage/RoomPage'
import RoomDetail from './pages/RoomDetail/RoomDetail'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Toaster } from 'react-hot-toast'
import DoashBoardPage from './pages/DoashBoardPage/DoashBoardPage'
import Template from './pages/Template/Template'
import LoadingPage from './components/Loading/LoadingPage'
import AdminPage from './pages/AdminPage/AdminPage'
import UserManager from './pages/AdminPage/UserManager'
import LocationManager from './pages/AdminPage/LocationManager'
import RoomManager from './pages/AdminPage/RoomManager'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

function App() {


  return (
    <>
      <LoadingPage />
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Template children={<HomePage />} />} />
          <Route path='/rooms/:locationId' element={<Template children={<RoomPage />} />} />
          <Route path='/rooms/:locationId/:roomId' element={<Template children={<RoomDetail />} />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/dashboard' element={<Template children={<DoashBoardPage />} />}></Route>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="user" element={<UserManager />} />
            <Route path="location" element={<LocationManager />} />
            <Route path="room" element={<RoomManager />} />
          </Route>
          <Route path='*' element={<NotFoundPage />}></Route>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
