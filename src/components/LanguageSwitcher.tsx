// LanguageSwitcher.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import Image from 'next/image';

interface LanguageOption {
  value: string;
  label: string;
  flag?: string;
}

interface LanguageSwitcherProps {
  options: LanguageOption[];
  variant?: 'dropdown' | 'buttons' | 'menu';
  className?: string;
}

/**
 * Dil değiştirme bileşeni
 * Farklı görünüm varyantları sunabilir: dropdown, buttons, veya menu
 */
export default function LanguageSwitcher({ options, variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LanguageOption | null>(null);
  
  // Mevcut dile göre seçili seçeneği belirle
  useEffect(() => {
    const current = options.find(option => option.value === locale) || options[0];
    setSelectedOption(current);
  }, [locale, options]);
  
  // Açılır menüyü kapat (tıklama dışında bir yere tıklanırsa)
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  // Dil değiştirme işlevi
  const handleSelectLanguage = (option: LanguageOption) => {
    setLocale(option.value);
    setIsOpen(false);
  };
  
  // Dropdown menü variantı
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {selectedOption?.flag && (
            <span className="w-5 h-5 overflow-hidden rounded-full">
              {selectedOption.flag.startsWith('http') ? (
                <Image 
                  src={selectedOption.flag} 
                  alt={selectedOption.label} 
                  width={20} 
                  height={20}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                  {selectedOption.value.toUpperCase().substring(0, 2)}
                </span>
              )}
            </span>
          )}
          <span>{selectedOption?.label || locale}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 min-w-[160px]">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`
                    flex items-center w-full gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                    ${option.value === locale ? 'bg-gray-50 dark:bg-gray-700' : ''}
                  `}
                  onClick={() => handleSelectLanguage(option)}
                >
                  {option.flag && (
                    <span className="w-5 h-5 overflow-hidden rounded-full">
                      {option.flag.startsWith('http') ? (
                        <Image 
                          src={option.flag} 
                          alt={option.label} 
                          width={20} 
                          height={20}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                          {option.value.toUpperCase().substring(0, 2)}
                        </span>
                      )}
                    </span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Butonlar variantı
  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`
              flex items-center gap-1 px-2 py-1 text-sm rounded
              ${option.value === locale 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'}
            `}
            onClick={() => handleSelectLanguage(option)}
          >
            {option.flag && (
              <span className="w-4 h-4 overflow-hidden rounded-full">
                {option.flag.startsWith('http') ? (
                  <Image 
                    src={option.flag} 
                    alt={option.label} 
                    width={16} 
                    height={16}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs bg-gray-200 dark:bg-gray-700">
                    {option.value.toUpperCase().substring(0, 2)}
                  </span>
                )}
              </span>
            )}
            <span>{option.value.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }
  
  // Menü variantı
  return (
    <div className={`${className}`}>
      <div className="flex flex-col space-y-1">
        {options.map((option) => (
          <button
            key={option.value}
            className={`
              flex items-center gap-2 px-3 py-2 text-left rounded
              ${option.value === locale 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
            onClick={() => handleSelectLanguage(option)}
          >
            {option.flag && (
              <span className="w-5 h-5 overflow-hidden rounded-full">
                {option.flag.startsWith('http') ? (
                  <Image 
                    src={option.flag} 
                    alt={option.label} 
                    width={20} 
                    height={20}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                    {option.value.toUpperCase().substring(0, 2)}
                  </span>
                )}
              </span>
            )}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
