from rest_framework import serializers
from .models import WorkoutSuggestion
from django.contrib.auth.models import User
from activities.models import Activity
from teams.models import Team

class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSuggestion
        fields = ['id', 'title', 'description', 'fitness_level', 'activity_type',
                  'duration_minutes', 'difficulty', 'created_at']
        read_only_fields = ['id', 'created_at']

class LeaderboardUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_points = serializers.IntegerField()
    rank = serializers.IntegerField()

class LeaderboardTeamSerializer(serializers.Serializer):
    team_id = serializers.IntegerField()
    team_name = serializers.CharField()
    total_points = serializers.IntegerField()
    member_count = serializers.IntegerField()
    rank = serializers.IntegerField()
