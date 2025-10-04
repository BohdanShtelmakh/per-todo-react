/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [isLoadingReg, setIsLoadingReg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regErrors, setRegErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  async function onRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setRegErrors({});

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '').trim();

    const errs: typeof regErrors = {};
    if (!name) errs.name = 'Name is required';
    if (!email) errs.email = 'Email is required';
    else if (!isEmail(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';

    if (Object.keys(errs).length) {
      setRegErrors(errs);
      return;
    }

    setIsLoadingReg(true);
    try {
      await register(email, password, name);
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoadingReg(false);
    }
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Create account</h2>
      <div className='text-gray-700 dark:text-gray-300 text-center mb-6'>
        <p className='opacity-80'>Register to start using the app.</p>
      </div>

      {error && (
        <div className='alert alert-error mb-4'>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onRegister} noValidate className='grid gap-3 max-w-md mx-auto  p-4 sm:p-6 shadow-sm'>
        <div className='grid gap-1'>
          <input
            className={`flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
              regErrors.name ? 'input-error' : ''
            }`}
            name='name'
            placeholder='Name'
            autoComplete='name'
            aria-invalid={!!regErrors.name}
            aria-describedby='reg-name-err'
          />
          {regErrors.name && (
            <p id='reg-name-err' className='text-sm text-red-500'>
              {regErrors.name}
            </p>
          )}
        </div>

        <div className='grid gap-1'>
          <input
            className={`flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
              regErrors.email ? 'input-error' : ''
            }`}
            name='email'
            placeholder='Email'
            type='email'
            autoComplete='email'
            aria-invalid={!!regErrors.email}
            aria-describedby='reg-email-err'
          />
          {regErrors.email && (
            <p id='reg-email-err' className='text-sm text-red-500'>
              {regErrors.email}
            </p>
          )}
        </div>

        <div className='grid gap-1'>
          <input
            className={`flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
              regErrors.password ? 'input-error' : ''
            }`}
            name='password'
            placeholder='Password'
            type='password'
            autoComplete='new-password'
            aria-invalid={!!regErrors.password}
            aria-describedby='reg-pass-err'
          />
          {regErrors.password && (
            <p id='reg-pass-err' className='text-sm text-red-500'>
              {regErrors.password}
            </p>
          )}
        </div>

        <button
          className='btn btn-primary w-full rounded px-4 py-2 font-semibold bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 '
          type='submit'
          disabled={isLoadingReg}
        >
          {isLoadingReg ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <div className='text-center mt-4'>
        <span className='text-sm'>Already have an account? </span>
        <Link className='link' to='/login'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
