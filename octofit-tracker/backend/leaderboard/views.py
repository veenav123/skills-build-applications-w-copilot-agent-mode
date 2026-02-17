from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import WorkoutSuggestion
from .serializers import (
    WorkoutSuggestionSerializer,
    LeaderboardUserSerializer,
    LeaderboardTeamSerializer
)
from users.models import UserProfile
from teams.models import Team

class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkoutSuggestion.objects.all()
        
        # Filter by fitness level
        fitness_level = self.request.query_params.get('fitness_level')
        if fitness_level:
            queryset = queryset.filter(fitness_level=fitness_level)
        
        # Filter by activity type
        activity_type = self.request.query_params.get('activity_type')
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        
        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_leaderboard(request):
    """Get user leaderboard sorted by total points"""
    profiles = UserProfile.objects.select_related('user').order_by('-total_points')[:50]
    
    leaderboard_data = []
    for rank, profile in enumerate(profiles, start=1):
        leaderboard_data.append({
            'user_id': profile.user.id,
            'username': profile.user.username,
            'total_points': profile.total_points,
            'rank': rank
        })
    
    serializer = LeaderboardUserSerializer(leaderboard_data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team_leaderboard(request):
    """Get team leaderboard sorted by total points"""
    teams = Team.objects.all().order_by('-total_points')[:50]
    
    leaderboard_data = []
    for rank, team in enumerate(teams, start=1):
        leaderboard_data.append({
            'team_id': team.id,
            'team_name': team.name,
            'total_points': team.total_points,
            'member_count': team.get_member_count(),
            'rank': rank
        })
    
    serializer = LeaderboardTeamSerializer(leaderboard_data, many=True)
    return Response(serializer.data)

