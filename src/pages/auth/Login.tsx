/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoginErrors({});

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '').trim();

    const errs: typeof loginErrors = {};
    if (!email) errs.email = 'Email is required';
    else if (!isEmail(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length) {
      setLoginErrors(errs);
      return;
    }

    setIsLoadingLogin(true);
    try {
      await login(email, password);
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to sign in');
    } finally {
      setIsLoadingLogin(false);
    }
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Sign in</h2>
      <div className='text-gray-700 dark:text-gray-300 text-center mb-6'>
        <p className='opacity-80'>Sign in to continue.</p>
      </div>

      {error && (
        <div className='alert alert-error mb-4'>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onLogin} noValidate className='grid gap-3 max-w-md mx-auto p-4 sm:p-6 shadow-sm'>
        <div className='grid gap-1'>
          <input
            className={`flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
              loginErrors.email ? 'input-error' : ''
            }`}
            name='email'
            placeholder='Email'
            type='email'
            autoComplete='email'
            aria-invalid={!!loginErrors.email}
            aria-describedby='login-email-err'
          />
          {loginErrors.email && (
            <p id='login-email-err' className='text-sm text-red-500'>
              {loginErrors.email}
            </p>
          )}
        </div>

        <div className='grid gap-1'>
            <div className='relative w-full'>
            <input
              className={`flex-1 w-full p-2 pr-10 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
              loginErrors.password ? 'input-error' : ''
              }`}
              name='password'
              placeholder='Password'
              type={showPw ? 'text' : 'password'}
              autoComplete='current-password'
              aria-invalid={!!loginErrors.password}
              aria-describedby='login-pass-err'
            />
            <button
              type='button'
              className='absolute right-2 top-1/2 -translate-y-1/2 px-2'
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPw ? (
              // Opened eye icon (visible)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              ) : (
              // Closed eye icon (hidden)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-3.362m3.31-2.21A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.032M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
              )}
            </button>
            </div>
          {loginErrors.password && (
            <p id='login-pass-err' className='text-sm text-red-500'>
              {loginErrors.password}
            </p>
          )}
        </div>

        <button
          className='btn btn-primary w-full rounded px-4 py-2 font-semibold bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 '
          type='submit'
          disabled={isLoadingLogin}
        >
          {isLoadingLogin ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <div className='text-center mt-4'>
        <span className='text-sm'>No account? </span>
        <Link className='link' to='/register'>
          Create one
        </Link>
      </div>
    </div>
  );
}
