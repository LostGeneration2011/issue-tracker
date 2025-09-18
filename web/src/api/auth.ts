import { http } from './http';

export async function login(email: string, password: string) {
  const data = await http.post<{ access_token: string }>('/auth/login', { email, password });
  localStorage.setItem('access_token', data.access_token);
  return data;
}

export async function register(email: string, password: string, role = 'USER') {
  return http.post('/auth/register', { email, password, role });
}

export function logout() {
  localStorage.removeItem('access_token');
}
