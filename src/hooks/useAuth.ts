import { authToken } from '../utils/authToken';
import api from '../utils/Axios';

export type AppUser = { id: string; email: string };

export async function register(email: string, password: string, name: string) {
  await api.post('/auth/register', { email, password, name });
  return login(email, password);
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });

  authToken.set(data.access_token);
  return data.user as AppUser;
}

export async function me(): Promise<AppUser> {
  const { data } = await api.get('/user/me');
  return data.user as AppUser;
}

export function logout() {
  authToken.clear();
  window.location.href = '/login';
}
