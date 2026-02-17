import React, { useState, useEffect } from 'react';
import { getActivities, createActivity, deleteActivity } from '../services/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
  });
  const [formData, setFormData] = useState({
    activity_type: 'running',
    duration_minutes: '',
    distance_km: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchActivities = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      
      const response = await getActivities(params);
      setActivities(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch activities. Please try again.');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await createActivity(formData);
      setSuccessMessage('Activity logged successfully!');
      setShowForm(false);
      setFormData({
        activity_type: 'running',
        duration_minutes: '',
        distance_km: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create activity. Please try again.');
      console.error('Error creating activity:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await deleteActivity(id);
      setSuccessMessage('Activity deleted successfully!');
      fetchActivities();
    } catch (err) {
      setError('Failed to delete activity. Please try again.');
      console.error('Error deleting activity:', err);
    }
  };

  const activityTypes = [
    'running', 'cycling', 'swimming', 'walking', 'gym_workout',
    'yoga', 'hiking', 'sports', 'other'
  ];

  if (loading && activities.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Activities</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Log New Activity'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Log New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="activity_type" className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    id="activity_type"
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleFormChange}
                    required
                  >
                    {activityTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="duration_minutes" className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleFormChange}
                    min="1"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="distance_km" className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="distance_km"
                    name="distance_km"
                    value={formData.distance_km}
                    onChange={handleFormChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Log Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filter Activities</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="start_date" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="start_date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="end_date" className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                id="end_date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Activity History</h5>
          {activities.length === 0 ? (
            <p className="text-muted">No activities found. Start logging your workouts!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Distance</th>
                    <th>Points</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity._id}>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td className="text-capitalize">{activity.activity_type.replace('_', ' ')}</td>
                      <td>{activity.duration_minutes} min</td>
                      <td>{activity.distance_km ? `${activity.distance_km} km` : '-'}</td>
                      <td><span className="badge bg-primary">{activity.points_earned} pts</span></td>
                      <td>{activity.notes || '-'}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(activity._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
