import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const taskService = {
  async getTasks() {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }
    return data;
  },

  async createTask(taskData) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create task');
    }
    return data;
  },

  async updateTask(id, updates) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update task');
    }
    return data;
  },

  async deleteTask(id) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete task');
    }
    return true;
  },

  async getStats() {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/stats/status`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }
    return data;
  }
};

export default taskService;