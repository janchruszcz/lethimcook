import { api } from './client';

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post('/login', {
    user: { email, password }
  });
  return data.data;
}

export async function signup(email: string, password: string): Promise<User> {
  const { data } = await api.post('/signup', {
    user: { email, password }
  });
  return data.data;
}

export async function logout(): Promise<void> {
  await api.delete('/logout');
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data;
}