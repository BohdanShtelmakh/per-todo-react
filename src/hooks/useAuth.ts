import { authToken } from '../utils/authToken';
import api from '../utils/Axios';

export type AppUser = { id: string; email: string };

export async function register(email: string, password: string, name: string) {
  await api.post('/auth/register', { email, password, name });
  // optional: auto-login
  return login(email, password);
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  // expects { accessToken, user }
  console.log(data);

  authToken.set(data.access_token);
  return data.user as AppUser;
}

export async function me(): Promise<AppUser> {
  const { data } = await api.get('/user/me');
  console.log('user /me', data);
  return data.user as AppUser;
}

export function logout() {
  authToken.clear();
}
