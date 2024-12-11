import React from 'react';
import clsx from 'clsx';

interface AuthTabsProps {
  activeTab: 'login' | 'signup';
  onTabChange: (tab: 'login' | 'signup') => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onTabChange('login')}
        className={clsx(
          'flex-1 py-3 text-sm font-medium transition-colors relative',
          activeTab === 'login'
            ? 'text-secondary'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        Log In
        {activeTab === 'login' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
        )}
      </button>
      <button
        onClick={() => onTabChange('signup')}
        className={clsx(
          'flex-1 py-3 text-sm font-medium transition-colors relative',
          activeTab === 'signup'
            ? 'text-secondary'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        Sign Up
        {activeTab === 'signup' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
        )}
      </button>
    </div>
  );
}