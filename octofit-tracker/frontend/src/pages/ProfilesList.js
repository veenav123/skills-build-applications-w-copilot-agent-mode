import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function ProfilesList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([
        apiService.getStudentProfiles(),
        apiService.getTeacherProfiles(),
      ]);
      setStudents(studentsData);
      setTeachers(teachersData);
    } catch (err) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
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
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>OctoFit Tracker Community</h2>
        <button className="btn btn-outline-primary" onClick={() => navigate('/profile')}>
          My Profile
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students ({students.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers ({teachers.length})
          </button>
        </li>
      </ul>

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="row">
          {students.length === 0 ? (
            <div className="col-12">
              <p className="text-muted">No students registered yet.</p>
            </div>
          ) : (
            students.map((profile) => (
              <div key={profile.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      {profile.user.first_name} {profile.user.last_name}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">@{profile.user.username}</small>
                    </p>
                    {profile.student_profile && (
                      <>
                        <p className="mb-1">
                          <strong>Grade:</strong> {profile.student_profile.grade_level}
                        </p>
                        <p className="mb-1">
                          <strong>Student ID:</strong> {profile.student_profile.student_id}
                        </p>
                        {profile.student_profile.preferred_activities && (
                          <p className="mb-1">
                            <strong>Activities:</strong><br />
                            <small>{profile.student_profile.preferred_activities}</small>
                          </p>
                        )}
                        {profile.student_profile.fitness_goals && (
                          <p className="mb-1 mt-2">
                            <strong>Goals:</strong><br />
                            <small className="text-muted">
                              {profile.student_profile.fitness_goals.length > 100
                                ? profile.student_profile.fitness_goals.substring(0, 100) + '...'
                                : profile.student_profile.fitness_goals}
                            </small>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === 'teachers' && (
        <div className="row">
          {teachers.length === 0 ? (
            <div className="col-12">
              <p className="text-muted">No teachers registered yet.</p>
            </div>
          ) : (
            teachers.map((profile) => (
              <div key={profile.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 border-success">
                  <div className="card-body">
                    <h5 className="card-title">
                      {profile.user.first_name} {profile.user.last_name}
                    </h5>
                    <p className="card-text">
                      <small className="text-muted">@{profile.user.username}</small>
                    </p>
                    {profile.teacher_profile && (
                      <>
                        <p className="mb-1">
                          <strong>Employee ID:</strong> {profile.teacher_profile.employee_id}
                        </p>
                        <p className="mb-1">
                          <strong>Experience:</strong> {profile.teacher_profile.years_of_experience} years
                        </p>
                        {profile.teacher_profile.specialization && (
                          <p className="mb-1">
                            <strong>Specialization:</strong><br />
                            <small>{profile.teacher_profile.specialization}</small>
                          </p>
                        )}
                        {profile.teacher_profile.certification && (
                          <p className="mb-1 mt-2">
                            <strong>Certifications:</strong><br />
                            <small className="text-muted">
                              {profile.teacher_profile.certification.length > 100
                                ? profile.teacher_profile.certification.substring(0, 100) + '...'
                                : profile.teacher_profile.certification}
                            </small>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilesList;
