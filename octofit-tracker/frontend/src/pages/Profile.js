import React, { useState, useEffect } from 'react';
import { getMyProfile, updateProfile } from '../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    fitness_level: '',
    fitness_goals: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      setProfile(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        bio: response.data.bio || '',
        fitness_level: response.data.fitness_level || '',
        fitness_goals: response.data.fitness_goals || '',
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
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
      await updateProfile(profile._id, formData);
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      bio: profile.bio || '',
      fitness_level: profile.fitness_level || '',
      fitness_goals: profile.fitness_goals || '',
    });
    setEditMode(false);
    setError('');
  };

  const fitnessLevels = ['beginner', 'intermediate', 'advanced'];

  if (loading) {
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
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Profile</h1>
            {!editMode && (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
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

          <div className="card">
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label"><strong>Username:</strong></label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.username}
                      disabled
                    />
                    <small className="form-text text-muted">Username cannot be changed</small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="first_name" className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="last_name" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fitness_level" className="form-label">Fitness Level</label>
                    <select
                      className="form-select"
                      id="fitness_level"
                      name="fitness_level"
                      value={formData.fitness_level}
                      onChange={handleChange}
                    >
                      <option value="">Select fitness level</option>
                      {fitnessLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fitness_goals" className="form-label">Fitness Goals</label>
                    <textarea
                      className="form-control"
                      id="fitness_goals"
                      name="fitness_goals"
                      rows="3"
                      value={formData.fitness_goals}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="mb-3">{profile.username}</h3>
                    <div className="mb-2">
                      <strong>Name:</strong>{' '}
                      {profile.first_name || profile.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : 'Not provided'}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {profile.email || 'Not provided'}
                    </div>
                    <div className="mb-2">
                      <strong>Fitness Level:</strong>{' '}
                      {profile.fitness_level ? (
                        <span className="badge bg-info">
                          {profile.fitness_level.charAt(0).toUpperCase() + profile.fitness_level.slice(1)}
                        </span>
                      ) : (
                        'Not set'
                      )}
                    </div>
                  </div>

                  <hr />

                  <div className="mb-4">
                    <h5>Bio</h5>
                    <p className="text-muted">{profile.bio || 'No bio provided.'}</p>
                  </div>

                  <div className="mb-4">
                    <h5>Fitness Goals</h5>
                    <p className="text-muted">{profile.fitness_goals || 'No fitness goals set.'}</p>
                  </div>

                  <hr />

                  <div className="row text-center">
                    <div className="col-md-4 mb-3">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Total Points</h6>
                          <h3 className="text-primary">{profile.total_points || 0}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Teams</h6>
                          <h3 className="text-success">{profile.teams?.length || 0}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Member Since</h6>
                          <h6 className="text-info">
                            {profile.date_joined
                              ? new Date(profile.date_joined).toLocaleDateString()
                              : 'N/A'}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
