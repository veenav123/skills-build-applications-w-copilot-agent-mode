import React, { useEffect, useState } from 'react';

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities`;

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Duration (min)</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.id}</td>
              <td>{activity.user}</td>
              <td>{activity.type}</td>
              <td>{activity.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Activities;
