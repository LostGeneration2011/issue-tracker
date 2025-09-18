const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function token() {
  return localStorage.getItem('access_token') || '';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  const t = token();
  if (t) headers.set('Authorization', `Bearer ${t}`);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export const http = {
  post: <T>(path: string, body: any) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  get:  <T>(path: string) => request<T>(path),
};
