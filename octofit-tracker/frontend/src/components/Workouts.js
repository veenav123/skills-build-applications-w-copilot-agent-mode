import React, { useEffect, useState } from 'react';

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map(workout => (
            <tr key={workout.id}>
              <td>{workout.id}</td>
              <td>{workout.name}</td>
              <td>{workout.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Workouts;
