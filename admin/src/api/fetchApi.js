

const API_BASE = 'http://localhost:5000';

async function fetchApi(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Debug: log token and request
  if (process.env.NODE_ENV !== 'production') {
    console.log('[fetchApi] Token:', token);
    console.log('[fetchApi] Request:', url, options);
  }
  // Prepend base URL if not already absolute
  const fullUrl = url.startsWith('http') ? url : API_BASE + url;
  const response = await fetch(fullUrl, { ...options, headers });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  if (!response.ok) {
    // Debug: log error response
    if (process.env.NODE_ENV !== 'production') {
      console.error('[fetchApi] Error response:', response.status, data);
    }
    // Show backend error message if available
    throw new Error((data && data.msg) || (data && data.message) || 'API error');
  }
  return data;
}

export default fetchApi;
