import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function Protected() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className='p-6'>Loading…</div>;
  return user ? <Outlet /> : <Navigate to='/login' replace />;
}
