import React, { useState, useEffect } from 'react';
import { getTeams, createTeam, joinTeam, leaveTeam, getMyProfile } from '../services/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const fetchTeamsData = async () => {
    try {
      setLoading(true);
      const [teamsRes, profileRes] = await Promise.all([
        getTeams(),
        getMyProfile(),
      ]);
      setTeams(teamsRes.data);
      setMyTeams(profileRes.data.teams || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch teams. Please try again.');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
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
      await createTeam(formData);
      setSuccessMessage('Team created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
      });
      fetchTeamsData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team. Please try again.');
      console.error('Error creating team:', err);
    }
  };

  const handleJoinTeam = async (teamId) => {
    setError('');
    setSuccessMessage('');

    try {
      await joinTeam(teamId);
      setSuccessMessage('Successfully joined the team!');
      fetchTeamsData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team. Please try again.');
      console.error('Error joining team:', err);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to leave this team?')) {
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      await leaveTeam(teamId);
      setSuccessMessage('Successfully left the team.');
      fetchTeamsData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave team. Please try again.');
      console.error('Error leaving team:', err);
    }
  };

  const isMyTeam = (teamId) => {
    return myTeams.some(team => team._id === teamId);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Teams</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Team'}
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
            <h5 className="card-title">Create New Team</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Create Team</button>
            </form>
          </div>
        </div>
      )}

      {myTeams.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-3">My Teams</h3>
          <div className="row">
            {myTeams.map((team) => (
              <div key={team._id} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100 border-primary">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{team.name}</h5>
                      <span className="badge bg-primary">Member</span>
                    </div>
                    <p className="card-text">{team.description || 'No description provided.'}</p>
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Members:</strong> {team.members?.length || 0}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Total Points:</strong> <span className="badge bg-success">{team.total_points || 0}</span>
                      </small>
                    </div>
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={() => handleLeaveTeam(team._id)}
                    >
                      Leave Team
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="mb-3">All Teams</h3>
      {teams.length === 0 ? (
        <div className="alert alert-info">
          No teams available. Create the first team!
        </div>
      ) : (
        <div className="row">
          {teams.map((team) => (
            <div key={team._id} className="col-md-6 col-lg-4 mb-3">
              <div className={`card h-100 ${isMyTeam(team._id) ? 'border-primary' : ''}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{team.name}</h5>
                    {isMyTeam(team._id) && <span className="badge bg-primary">Joined</span>}
                  </div>
                  <p className="card-text">{team.description || 'No description provided.'}</p>
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Members:</strong> {team.members?.length || 0}
                    </small>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Total Points:</strong> <span className="badge bg-success">{team.total_points || 0}</span>
                    </small>
                  </div>
                  {isMyTeam(team._id) ? (
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={() => handleLeaveTeam(team._id)}
                    >
                      Leave Team
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => handleJoinTeam(team._id)}
                    >
                      Join Team
                    </button>
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

export default Teams;
