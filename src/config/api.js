const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

export const API_BASE_URL = configuredApiBaseUrl
  ? configuredApiBaseUrl.endsWith('/api') ? configuredApiBaseUrl : `${configuredApiBaseUrl}/api`
  : '/api';

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/api/') ? path.slice(4) : path === '/api' ? '' : path;
  return `${API_BASE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
};
