import React, { useState, useEffect } from 'react';
import { getUserLeaderboard, getTeamLeaderboard } from '../services/api';

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        getUserLeaderboard(),
        getTeamLeaderboard(),
      ]);
      setUserLeaderboard(usersRes.data);
      setTeamLeaderboard(teamsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again.');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
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
      <h1 className="mb-4">Leaderboard</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Leaderboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Team Leaderboard
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">Top Users</h5>
            {userLeaderboard.length === 0 ? (
              <p className="text-muted">No users on the leaderboard yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Rank</th>
                      <th>Username</th>
                      <th>Total Points</th>
                      <th>Total Activities</th>
                      <th>Total Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLeaderboard.map((user, index) => (
                      <tr key={user._id} className={index < 3 ? 'table-warning' : ''}>
                        <td className="text-center">
                          <span style={{ fontSize: '1.5rem' }}>
                            {getMedalIcon(index + 1)}
                          </span>
                        </td>
                        <td>
                          <strong>{user.username}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary fs-6">
                            {user.total_points || 0} pts
                          </span>
                        </td>
                        <td>{user.activity_count || 0}</td>
                        <td>{user.total_duration || 0} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">Top Teams</h5>
            {teamLeaderboard.length === 0 ? (
              <p className="text-muted">No teams on the leaderboard yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Rank</th>
                      <th>Team Name</th>
                      <th>Total Points</th>
                      <th>Members</th>
                      <th>Average Points/Member</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaderboard.map((team, index) => (
                      <tr key={team._id} className={index < 3 ? 'table-success' : ''}>
                        <td className="text-center">
                          <span style={{ fontSize: '1.5rem' }}>
                            {getMedalIcon(index + 1)}
                          </span>
                        </td>
                        <td>
                          <strong>{team.name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-success fs-6">
                            {team.total_points || 0} pts
                          </span>
                        </td>
                        <td>{team.members?.length || 0}</td>
                        <td>
                          {team.members?.length > 0
                            ? Math.round((team.total_points || 0) / team.members.length)
                            : 0}{' '}
                          pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={fetchLeaderboardData}>
          Refresh Leaderboard
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;
