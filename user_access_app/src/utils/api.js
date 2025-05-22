// src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle empty responses (like 204 No Content)
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        data = null;
      }
    }
    
    return {
      success: response.ok,
      data,
      status: response.status,
      message: data?.message || (response.ok ? 'Success' : `Request failed with status ${response.status}`),
      error: !response.ok ? (data?.message || `HTTP ${response.status}`) : null
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message,
      data: null,
      status: 0,
      message: error.message
    };
  }
};

export const apiCallWithAuth = async (endpoint, token, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  return apiCall(endpoint, options);
};