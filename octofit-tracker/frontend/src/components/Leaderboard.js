import React, { useEffect, useState } from 'react';

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard`;

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/')
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.user}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
