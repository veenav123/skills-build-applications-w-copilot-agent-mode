"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

from users.views import UserViewSet, UserProfileViewSet
from activities.views import ActivityViewSet
from teams.views import TeamViewSet
from leaderboard.views import WorkoutSuggestionViewSet, user_leaderboard, team_leaderboard

# Create router and register viewsets
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'workout-suggestions', WorkoutSuggestionViewSet, basename='workout-suggestion')

@api_view(['GET'])
def api_root(request):
    """API root endpoint showing available endpoints"""
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    
    return Response({
        'message': 'Welcome to OctoFit Tracker API',
        'endpoints': {
            'users': f'{base_url}/api/users/',
            'profiles': f'{base_url}/api/profiles/',
            'activities': f'{base_url}/api/activities/',
            'teams': f'{base_url}/api/teams/',
            'workout_suggestions': f'{base_url}/api/workout-suggestions/',
            'user_leaderboard': f'{base_url}/api/leaderboard/users/',
            'team_leaderboard': f'{base_url}/api/leaderboard/teams/',
            'auth': {
                'login': f'{base_url}/api/auth/login/',
                'logout': f'{base_url}/api/auth/logout/',
                'register': f'{base_url}/api/users/register/',
            }
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/leaderboard/users/', user_leaderboard, name='user-leaderboard'),
    path('api/leaderboard/teams/', team_leaderboard, name='team-leaderboard'),
]
