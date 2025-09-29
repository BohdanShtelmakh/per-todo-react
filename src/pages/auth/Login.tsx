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

      <form
        onSubmit={onLogin}
        noValidate
        className='grid gap-3 max-w-md mx-auto rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 sm:p-6 shadow-sm'
      >
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
          <div className='join w-full'>
            <input
              className={`flex-1 w-full p-2 pr-8 border rounded dark:bg-zinc-800 dark:border-zinc-600 ${
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
              className='btn join-item'
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          {loginErrors.password && (
            <p id='login-pass-err' className='text-sm text-red-500'>
              {loginErrors.password}
            </p>
          )}
        </div>

        <button className='btn btn-primary w-full' type='submit' disabled={isLoadingLogin}>
          {isLoadingLogin ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <div className='text-center mt-4'>
        <span className='text-sm'>No account? </span>
        <Link className='link' to='/register'>
          Create one
        </Link>
      </div>
      <p className='text-center mt-2'>
        <Link className='link' to='/'>
          Back
        </Link>
      </p>
    </div>
  );
}
