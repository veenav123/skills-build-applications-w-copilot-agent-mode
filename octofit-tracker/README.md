# OctoFit Tracker

A comprehensive fitness tracking application built with React, Django REST Framework, and MongoDB.

## Features

- **User Authentication**: Register and login with secure authentication
- **Activity Logging**: Track various types of physical activities including running, walking, cycling, swimming, strength training, yoga, and sports
- **Points System**: Earn points for activities based on type and duration
- **Team Management**: Create teams, join teams, and compete with others
- **Leaderboards**: View rankings for both individuals and teams
- **Personalized Workouts**: Get workout suggestions based on your fitness level
- **Profile Management**: Track your total points, fitness level, and goals

## Technology Stack

### Frontend
- **React.js**: UI library for building interactive interfaces
- **React Router**: Client-side routing
- **Bootstrap 5**: CSS framework for responsive design
- **Axios**: HTTP client for API requests

### Backend
- **Django 4.1.7**: Python web framework
- **Django REST Framework**: RESTful API toolkit
- **MongoDB**: NoSQL database via Djongo
- **dj-rest-auth**: Authentication endpoints
- **django-allauth**: User registration and authentication
- **django-cors-headers**: CORS handling

## Project Structure

```
octofit-tracker/
├── backend/
│   ├── octofit_tracker/         # Django project settings
│   ├── users/                   # User profiles app
│   ├── activities/              # Activity tracking app
│   ├── teams/                   # Team management app
│   ├── leaderboard/             # Leaderboard and workout suggestions
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/               # Page components
    │   ├── services/            # API service layer
    │   └── App.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd octofit-tracker/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start MongoDB:**
   ```bash
   # Using the included script
   ../../mongodb.sh start
   
   # Or using systemctl (if available)
   sudo systemctl start mongod
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Seed workout suggestions (optional):**
   ```bash
   python manage.py shell < seed_data.py
   ```

8. **Start development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

The backend API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd octofit-tracker/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/registration/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout

### Users
- `GET /api/profiles/my_profile/` - Get current user's profile
- `PATCH /api/profiles/{id}/` - Update profile

### Activities
- `GET /api/activities/` - List user's activities
- `POST /api/activities/` - Create new activity
- `GET /api/activities/my_stats/` - Get activity statistics
- `GET /api/activities/recent/` - Get recent activities
- `DELETE /api/activities/{id}/` - Delete activity

### Teams
- `GET /api/teams/` - List all teams
- `POST /api/teams/` - Create new team
- `GET /api/teams/{id}/` - Get team details
- `POST /api/teams/{id}/join/` - Join a team
- `POST /api/teams/{id}/leave/` - Leave a team
- `POST /api/teams/{id}/add_member/` - Add member to team (captain only)
- `GET /api/teams/{id}/refresh_points/` - Refresh team points

### Leaderboards
- `GET /api/leaderboard/users/` - Get user leaderboard
- `GET /api/leaderboard/teams/` - Get team leaderboard

### Workout Suggestions
- `GET /api/workout-suggestions/` - List workout suggestions
- `POST /api/workout-suggestions/` - Create workout suggestion (admin)

## Usage

1. **Register an Account**: Click "Register" and create your account
2. **Log Activities**: Go to Activities page and log your workouts
3. **Earn Points**: Points are automatically calculated based on activity type and duration
4. **Join or Create Teams**: Compete with friends by joining or creating teams
5. **Check Rankings**: View your position on the leaderboard
6. **Get Suggestions**: Browse personalized workout suggestions

## Points System

Activities earn points based on duration and type:
- Running: 10 points per 10 minutes
- Swimming: 12 points per 10 minutes
- Cycling: 8 points per 10 minutes
- Strength Training: 8 points per 10 minutes
- Yoga: 6 points per 10 minutes
- Walking: 5 points per 10 minutes
- Sports: 10 points per 10 minutes
- Other: 5 points per 10 minutes

## Screenshots

(Screenshots will be added after testing the application)

## Contributing

This is a learning project for demonstrating GitHub Copilot agent mode capabilities.

## License

MIT License

## Acknowledgments

- Built as part of the GitHub Copilot agent mode tutorial
- Inspired by Paul Octo's vision for Mergington High School fitness tracking
