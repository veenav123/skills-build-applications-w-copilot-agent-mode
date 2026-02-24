
// Bootstrap CDN import for React
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Bootstrap Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#">
            <img src={require('../../../../docs/octofitapp-small.png')} alt="Octofit Logo" className="octofit-logo" />
            Octofit Tracker
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="#">Activities</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Leaderboard</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Teams</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Users</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Workouts</a></li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Bootstrap Card for Welcome */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h2 className="card-title display-6 mb-3">Welcome to Octofit Tracker!</h2>
                <p className="card-text">Track your fitness, join teams, compete, and get personalized workouts.</p>
                <a href="#" className="btn btn-primary">Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Example Bootstrap Table */}
      <div className="container mb-5">
        <h3 className="mb-3">Sample Leaderboard</h3>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">User</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Jane Doe</td>
              <td>1200</td>
            </tr>
            <tr>
              <td>2</td>
              <td>John Smith</td>
              <td>1100</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Alex Lee</td>
              <td>950</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

export default App;
