'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth-actions';

interface RegisterFormProps {
  locale: string;
  translations: any;
}

export default function RegisterForm({ locale, translations }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    
    // Password check
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      setError(translations.passwordsDoNotMatch || 'Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Add locale to form data
    formData.append('locale', locale);
    
    try {
      const result = await registerUser(formData);
      
      if (!result.success) {
        setError(result.message || translations.registrationFailed || 'Registration failed');
      } else if (result.redirect) {
        // Successful registration with redirect URL
        window.location.href = result.redirect;
      }
    } catch (err) {
      setError(translations.registrationFailed || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.createAccount || 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {translations.alreadyHaveAccount || 'Already have an account?'}{' '}
          <Link 
            href={`/${locale}/login`} 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {translations.signIn || 'Sign in'}
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="mt-8 space-y-6" action={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.firstName || 'First Name'}*
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.lastName || 'Last Name'}*
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.emailAddress || 'Email address'}*
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.password || 'Password'}*
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {translations.passwordRequirements || 'Must be at least 8 characters with 1 uppercase, 1 number and 1 special character'}
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.confirmPassword || 'Confirm Password'}*
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.phoneNumber || 'Phone Number'}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms-agree"
            name="termsAgree"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label htmlFor="terms-agree" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {translations.agreeToTerms || 'I agree to the'}{' '}
            <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {translations.termsAndConditions || 'Terms and Conditions'}
            </Link>{' '}
            {translations.andThe || 'and the'}{' '}
            <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {translations.privacyPolicy || 'Privacy Policy'}
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-70"
          >
            {isLoading 
              ? (translations.creatingAccount || 'Creating account...') 
              : (translations.createAccount || 'Create Account')}
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
      
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        {translations.byCreatingAccount || 'By creating an account, you will receive eSIM updates and offers. You can opt out at any time.'}
      </div>
    </div>
  );
}
