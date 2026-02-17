import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    // Student fields
    grade_level: '',
    student_id: '',
    fitness_goals: '',
    preferred_activities: '',
    // Teacher fields
    employee_id: '',
    specialization: '',
    years_of_experience: '',
    certification: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: userType,
      };

      // Add user-type-specific fields
      if (userType === 'student') {
        registrationData.grade_level = parseInt(formData.grade_level);
        registrationData.student_id = formData.student_id;
        registrationData.fitness_goals = formData.fitness_goals;
        registrationData.preferred_activities = formData.preferred_activities;
      } else {
        registrationData.employee_id = formData.employee_id;
        registrationData.specialization = formData.specialization;
        registrationData.years_of_experience = parseInt(formData.years_of_experience) || 0;
        registrationData.certification = formData.certification;
      }

      await apiService.register(registrationData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Register for OctoFit Tracker</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div className="mb-3">
                  <label className="form-label">I am a:</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userType"
                        id="student"
                        value="student"
                        checked={userType === 'student'}
                        onChange={handleUserTypeChange}
                      />
                      <label className="form-check-label" htmlFor="student">
                        Student
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userType"
                        id="teacher"
                        value="teacher"
                        checked={userType === 'teacher'}
                        onChange={handleUserTypeChange}
                      />
                      <label className="form-check-label" htmlFor="teacher">
                        Gym Teacher
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="username" className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="first_name" className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password2" className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Student-Specific Fields */}
                {userType === 'student' && (
                  <>
                    <hr />
                    <h5>Student Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="student_id" className="form-label">Student ID *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="student_id"
                          name="student_id"
                          value={formData.student_id}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="grade_level" className="form-label">Grade Level (9-12) *</label>
                        <input
                          type="number"
                          className="form-control"
                          id="grade_level"
                          name="grade_level"
                          min="9"
                          max="12"
                          value={formData.grade_level}
                          onChange={handleChange}
                          required
                        />
                      </div>
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
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="preferred_activities" className="form-label">Preferred Activities</label>
                      <input
                        type="text"
                        className="form-control"
                        id="preferred_activities"
                        name="preferred_activities"
                        placeholder="e.g., Basketball, Swimming, Running"
                        value={formData.preferred_activities}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Teacher-Specific Fields */}
                {userType === 'teacher' && (
                  <>
                    <hr />
                    <h5>Teacher Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="employee_id" className="form-label">Employee ID *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="employee_id"
                          name="employee_id"
                          value={formData.employee_id}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="years_of_experience" className="form-label">Years of Experience</label>
                        <input
                          type="number"
                          className="form-control"
                          id="years_of_experience"
                          name="years_of_experience"
                          min="0"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="specialization" className="form-label">Specialization</label>
                      <input
                        type="text"
                        className="form-control"
                        id="specialization"
                        name="specialization"
                        placeholder="e.g., Basketball, Swimming, Fitness Training"
                        value={formData.specialization}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="certification" className="form-label">Certifications</label>
                      <textarea
                        className="form-control"
                        id="certification"
                        name="certification"
                        rows="3"
                        value={formData.certification}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-center">
                <p>
                  Already have an account?{' '}
                  <button 
                    className="btn btn-link p-0"
                    onClick={() => navigate('/login')}
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
