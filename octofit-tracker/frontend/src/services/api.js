import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const register = (userData) => api.post('/auth/registration/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const logout = () => api.post('/auth/logout/');

// User Profile
export const getMyProfile = () => api.get('/profiles/my_profile/');
export const updateProfile = (profileId, data) => api.patch(`/profiles/${profileId}/`, data);

// Activities
export const getActivities = (params) => api.get('/activities/', { params });
export const createActivity = (data) => api.post('/activities/', data);
export const getActivity = (id) => api.get(`/activities/${id}/`);
export const updateActivity = (id, data) => api.patch(`/activities/${id}/`, data);
export const deleteActivity = (id) => api.delete(`/activities/${id}/`);
export const getMyStats = () => api.get('/activities/my_stats/');
export const getRecentActivities = (days = 7) => api.get(`/activities/recent/?days=${days}`);

// Teams
export const getTeams = (params) => api.get('/teams/', { params });
export const createTeam = (data) => api.post('/teams/', data);
export const getTeam = (id) => api.get(`/teams/${id}/`);
export const joinTeam = (id) => api.post(`/teams/${id}/join/`);
export const leaveTeam = (id) => api.post(`/teams/${id}/leave/`);
export const addTeamMember = (id, userId) => api.post(`/teams/${id}/add_member/`, { user_id: userId });
export const refreshTeamPoints = (id) => api.get(`/teams/${id}/refresh_points/`);

// Leaderboard
export const getUserLeaderboard = () => api.get('/leaderboard/users/');
export const getTeamLeaderboard = () => api.get('/leaderboard/teams/');

// Workout Suggestions
export const getWorkoutSuggestions = (params) => api.get('/workout-suggestions/', { params });
export const createWorkoutSuggestion = (data) => api.post('/workout-suggestions/', data);

export default api;
