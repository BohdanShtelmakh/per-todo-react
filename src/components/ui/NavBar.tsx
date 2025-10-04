import { Link, Outlet } from 'react-router-dom';
import { logout } from '../../hooks/useAuth';
import { useAuth } from '../../state/AuthContext';
import { Theme } from './Theme';

export default function NavBar() {
  const { user } = useAuth();
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-4'>
          <Link to='/'>Home</Link>
          <span>|</span>
          <Link to='/about'>About</Link>
          <span>|</span>
          {user ? (
            <>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
        <Theme />
      </div>
      <Outlet />
    </>
  );
}
