import React, { useState, useEffect } from 'react';
import { getWorkoutSuggestions } from '../services/api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    fitness_level: '',
    activity_type: '',
  });

  const fetchWorkouts = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.fitness_level) params.fitness_level = filters.fitness_level;
      if (filters.activity_type) params.activity_type = filters.activity_type;

      const response = await getWorkoutSuggestions(params);
      setWorkouts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch workout suggestions. Please try again.');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      fitness_level: '',
      activity_type: '',
    });
  };

  const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
  const activityTypes = [
    'running', 'cycling', 'swimming', 'walking', 'gym_workout',
    'yoga', 'hiking', 'sports', 'other'
  ];

  const getFitnessLevelBadge = (level) => {
    const badges = {
      beginner: 'bg-success',
      intermediate: 'bg-warning',
      advanced: 'bg-danger',
    };
    return badges[level] || 'bg-secondary';
  };

  if (loading && workouts.length === 0) {
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
      <h1 className="mb-4">Workout Suggestions</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filter Workouts</h5>
          <div className="row">
            <div className="col-md-5 mb-3">
              <label htmlFor="fitness_level" className="form-label">Fitness Level</label>
              <select
                className="form-select"
                id="fitness_level"
                name="fitness_level"
                value={filters.fitness_level}
                onChange={handleFilterChange}
              >
                <option value="">All Levels</option>
                {fitnessLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5 mb-3">
              <label htmlFor="activity_type" className="form-label">Activity Type</label>
              <select
                className="form-select"
                id="activity_type"
                name="activity_type"
                value={filters.activity_type}
                onChange={handleFilterChange}
              >
                <option value="">All Activities</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button className="btn btn-secondary w-100" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="alert alert-info">
          No workout suggestions available. Try adjusting your filters.
        </div>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{workout.title}</h5>
                    <span className={`badge ${getFitnessLevelBadge(workout.fitness_level)}`}>
                      {workout.fitness_level}
                    </span>
                  </div>
                  <h6 className="card-subtitle mb-3 text-muted text-capitalize">
                    {workout.activity_type.replace('_', ' ')}
                  </h6>
                  <p className="card-text">{workout.description}</p>
                  <div className="mt-3">
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Duration:</strong> {workout.duration_minutes} minutes
                      </small>
                    </div>
                    {workout.target_distance && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <strong>Target Distance:</strong> {workout.target_distance} km
                        </small>
                      </div>
                    )}
                    {workout.estimated_calories && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <strong>Est. Calories:</strong> {workout.estimated_calories} kcal
                        </small>
                      </div>
                    )}
                  </div>
                  {workout.instructions && (
                    <div className="mt-3">
                      <strong>Instructions:</strong>
                      <p className="small mt-2">{workout.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
