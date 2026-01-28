const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Generic API call method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth APIs
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async createUser(userData) {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers() {
    return this.request('/auth/users', {
      method: 'GET',
    });
  }

  async updateUser(username, userData) {
    return this.request(`/auth/users/${username}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(username) {
    return this.request(`/auth/users/${username}`, {
      method: 'DELETE',
    });
  }

  async getUserData(username) {
    return this.request(`/auth/users/${username}`, {
      method: 'GET',
    });
  }

  // Asset APIs (examples - update based on your actual endpoints)
  async getAssets() {
    return this.request('/assets', {
      method: 'GET',
    });
  }

  async getAsset(id) {
    return this.request(`/assets/${id}`, {
      method: 'GET',
    });
  }

  async createAsset(assetData) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  }

  async updateAsset(id, assetData) {
    return this.request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  }

  async deleteAsset(id) {
    return this.request(`/assets/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
