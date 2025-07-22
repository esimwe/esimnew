'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/app/actions/auth-actions';

interface LoginFormProps {
  locale: string;
  translations: any;
}

export default function LoginForm({ locale, translations }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    
    // Add locale to form data
    formData.append('locale', locale);
    
    try {
      const result = await loginUser(formData);
      
      if (!result.success) {
        setError(result.message || translations.loginFailed || 'Login failed');
      } else if (result.redirect) {
        // Successful login with redirect URL
        window.location.href = result.redirect;
      }
    } catch (err) {
      setError(translations.loginFailed || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.signIn || 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {translations.or || 'Or'}{' '}
          <Link 
            href={`/${locale}/register`} 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {translations.createAccount || 'create a new account'}
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" action={handleSubmit}>
        <input type="hidden" name="callbackUrl" value={`/${locale}`} />
        <input type="hidden" name="remember" value="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              {translations.emailAddress || 'Email address'}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.emailAddress || 'Email address'}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              {translations.password || 'Password'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.password || 'Password'}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {translations.rememberMe || 'Remember me'}
            </label>
          </div>

          <div className="text-sm">
            <Link
              href={`/${locale}/forgot-password`}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {translations.forgotPassword || 'Forgot your password?'}
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-70"
          >
            {isLoading 
              ? (translations.signingIn || 'Signing in...') 
              : (translations.signIn || 'Sign in')}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              {translations.orContinueWith || 'Or continue with'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <Link
            href={`/api/auth/signin/google?callbackUrl=/${locale}`}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span>Google</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
