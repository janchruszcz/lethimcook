import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToastStore } from '../../stores/toastStore';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      showToast('Logged in successfully', 'success');
      onSuccess();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        required
      />

      <FormInput
        type="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        required
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Log In
      </Button>
    </form>
  );
}