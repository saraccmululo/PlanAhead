import logo from '../assets/logo.png'
import LoginLogoutButton from './authentication/LoginLogoutButton'

const Header = () => {
  return (
    <header className="d-flex align-items-center justify-content-between px-3 py-2" style={{ backgroundColor: '#E5E7EB' }}>
        <img src={logo}  alt="PlanAhead logo with a clipboard image" className="img-fluid" style={{height: '50px'}}/>
        <p className='mb-0 header-tagline'>See the week, own the day</p>
        <LoginLogoutButton/>
    </header>
  )
}

export default Header

