import './App.css';

function App() {
  return (
    <div className="App">
      <nav style={{ background: '#f8f9fa', padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 'bold', marginRight: '20px' }}>Octofit Tracker</span>
        <a href="#" style={{ marginRight: '15px', color: '#333', textDecoration: 'none' }}>Activities</a>
        <a href="#" style={{ marginRight: '15px', color: '#333', textDecoration: 'none' }}>Leaderboard</a>
        <a href="#" style={{ marginRight: '15px', color: '#333', textDecoration: 'none' }}>Teams</a>
        <a href="#" style={{ marginRight: '15px', color: '#333', textDecoration: 'none' }}>Users</a>
        <a href="#" style={{ marginRight: '15px', color: '#333', textDecoration: 'none' }}>Workouts</a>
      </nav>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Welcome to Octofit Tracker!</h2>
      </div>
    </div>
  );
}

export default App;
