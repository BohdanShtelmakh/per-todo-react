import { Link, Outlet } from 'react-router-dom';
import { Theme } from './Theme';

export default function NavBar() {
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-4'>
          <Link to='/'>Home</Link>
          <span>|</span>
          <Link to='/about'>About</Link>
        </div>
        <Theme />
      </div>
      <Outlet />
    </>
  );
}
