// Shared API client — configured once at app startup, used by all hooks.
// Web configures with '' (relative URLs work in browser).
// Mobile configures with 'http://localhost:3000' to reach Next.js dev server.

let _baseUrl = '';

export function configureApi(baseUrl) {
  _baseUrl = baseUrl;
}

export async function apiGet(path) {
  const url = _baseUrl ? `${_baseUrl}${path}` : path;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export async function apiPut(path, body) {
  const url = _baseUrl ? `${_baseUrl}${path}` : path;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}
