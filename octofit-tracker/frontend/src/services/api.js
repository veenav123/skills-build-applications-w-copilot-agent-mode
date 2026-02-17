// API service for OctoFit Tracker backend communication

const getBaseUrl = () => {
  // Check if we're in a Codespace
  const codespace = process.env.REACT_APP_CODESPACE_NAME || window.CODESPACE_NAME;
  if (codespace) {
    return `https://${codespace}-8000.app.github.dev`;
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  }

  // Registration
  async register(userData) {
    const response = await fetch(`${this.baseUrl}/api/register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Login
  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/api/auth/login/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    const data = await this.handleResponse(response);
    if (data.key) {
      this.setToken(data.key);
    }
    return data;
  }

  // Logout
  async logout() {
    const response = await fetch(`${this.baseUrl}/api/auth/logout/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    this.setToken(null);
    return this.handleResponse(response);
  }

  // Get current user profile
  async getCurrentProfile() {
    const response = await fetch(`${this.baseUrl}/api/profiles/me/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get all profiles
  async getProfiles() {
    const response = await fetch(`${this.baseUrl}/api/profiles/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get student profiles
  async getStudentProfiles() {
    const response = await fetch(`${this.baseUrl}/api/profiles/students/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get teacher profiles
  async getTeacherProfiles() {
    const response = await fetch(`${this.baseUrl}/api/profiles/teachers/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Update profile
  async updateProfile(profileId, data) {
    const response = await fetch(`${this.baseUrl}/api/profiles/${profileId}/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Update student profile
  async updateStudentProfile(studentProfileId, data) {
    const response = await fetch(`${this.baseUrl}/api/student-profiles/${studentProfileId}/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Update teacher profile
  async updateTeacherProfile(teacherProfileId, data) {
    const response = await fetch(`${this.baseUrl}/api/teacher-profiles/${teacherProfileId}/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();
