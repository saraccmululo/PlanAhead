import {Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Calendar from './components/calendar/Calendar.jsx'

import Login from './components/authentication/Login.jsx'
import SubmitNewPassword from './components/authentication/SubmitNewPassword.jsx'

function App() {
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 py-3 px-3">
        <ToastContainer position="top-right" 
          autoClose={1500} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
          toastClassName="mobileToast"/>
        <Routes>
          <Route path="/" element={<Calendar/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/reset-password/:token" element={<SubmitNewPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
