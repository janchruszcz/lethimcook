import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { useAuthStore } from '../../stores/useAuthStore';

interface SignupFormProps {
  onSuccess: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, passwordConfirmation);
      onSuccess();
    } catch (err) {
      setError('Failed to create account');
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
        placeholder="Choose a password"
        required
      />

      <FormInput
        type="password"
        label="Password Confirmation"
        value={passwordConfirmation}
        onChange={setPasswordConfirmation}
        placeholder="Confirm your password"
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
        Create Account
      </Button>
    </form>
  );
}