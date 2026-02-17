import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiService.getCurrentProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      if (err.message.includes('401') || err.message.includes('403')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isStudent = profile.user_type === 'student';
  const isTeacher = profile.user_type === 'teacher';

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>My Profile</h3>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <div className="card-body">
              {/* User Basic Info */}
              <div className="mb-4">
                <h5 className="text-primary">
                  {isStudent && '🎓 Student Profile'}
                  {isTeacher && '👨‍🏫 Gym Teacher Profile'}
                </h5>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {profile.user.first_name} {profile.user.last_name}</p>
                    <p><strong>Username:</strong> {profile.user.username}</p>
                    <p><strong>Email:</strong> {profile.user.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>User Type:</strong> {profile.user_type === 'student' ? 'Student' : 'Gym Teacher'}</p>
                    <p><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {profile.bio && (
                  <div className="mt-3">
                    <p><strong>Bio:</strong></p>
                    <p>{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Student-Specific Info */}
              {isStudent && profile.student_profile && (
                <>
                  <hr />
                  <div className="mb-4">
                    <h5 className="text-info">Student Details</h5>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <p><strong>Student ID:</strong> {profile.student_profile.student_id}</p>
                        <p><strong>Grade Level:</strong> {profile.student_profile.grade_level}</p>
                      </div>
                      <div className="col-md-6">
                        {profile.student_profile.preferred_activities && (
                          <p><strong>Preferred Activities:</strong><br />
                            {profile.student_profile.preferred_activities}
                          </p>
                        )}
                      </div>
                    </div>
                    {profile.student_profile.fitness_goals && (
                      <div className="mt-3">
                        <p><strong>Fitness Goals:</strong></p>
                        <p className="text-muted">{profile.student_profile.fitness_goals}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Teacher-Specific Info */}
              {isTeacher && profile.teacher_profile && (
                <>
                  <hr />
                  <div className="mb-4">
                    <h5 className="text-success">Teacher Details</h5>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <p><strong>Employee ID:</strong> {profile.teacher_profile.employee_id}</p>
                        <p><strong>Years of Experience:</strong> {profile.teacher_profile.years_of_experience} years</p>
                      </div>
                      <div className="col-md-6">
                        {profile.teacher_profile.specialization && (
                          <p><strong>Specialization:</strong><br />
                            {profile.teacher_profile.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                    {profile.teacher_profile.certification && (
                      <div className="mt-3">
                        <p><strong>Certifications:</strong></p>
                        <p className="text-muted">{profile.teacher_profile.certification}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/profiles')}
                >
                  View All Profiles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
