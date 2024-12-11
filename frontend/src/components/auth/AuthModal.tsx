import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Modal } from '../ui/Modal';
import { AuthTabs } from './AuthTabs';
import { AuthIllustration } from './AuthIllustration';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <Modal onClose={onClose} size="lg">
      <div className="flex">
        <AuthIllustration />
        
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'login' ? 'Welcome' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {activeTab === 'login' ? (
              <LoginForm onSuccess={onClose} />
            ) : (
              <SignupForm onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}