'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/app/actions/auth-actions';

interface AdminLoginFormProps {
  locale: string;
  translations: any;
}

export default function AdminLoginForm({ locale, translations }: AdminLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    
    // Add locale to form data
    formData.append('locale', locale);
    // Set callback URL to admin dashboard
    formData.append('callbackUrl', `/${locale}/admin/dashboard`);
    
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
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.adminLogin || 'Admin Login'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {translations.adminLoginDescription || 'Sign in to the admin dashboard'}
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" action={handleSubmit}>
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.password || 'Password'}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-70"
          >
            {isLoading 
              ? (translations.signingIn || 'Signing in...') 
              : (translations.signIn || 'Sign in')}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <Link 
          href={`/${locale}`} 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          {translations.backToWebsite || 'Back to website'}
        </Link>
      </div>
    </div>
  );
}
