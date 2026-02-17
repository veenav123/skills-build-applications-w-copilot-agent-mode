from rest_framework import serializers
from .models import WorkoutSuggestion
from django.contrib.auth.models import User
from activities.models import Activity
from teams.models import Team

class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkoutSuggestion
        fields = ['_id', 'title', 'description', 'fitness_level', 'activity_type',
                  'duration_minutes', 'difficulty', 'created_at']
        read_only_fields = ['_id', 'created_at']
    
    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None

class LeaderboardUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_points = serializers.IntegerField()
    rank = serializers.IntegerField()

class LeaderboardTeamSerializer(serializers.Serializer):
    team_id = serializers.CharField()
    team_name = serializers.CharField()
    total_points = serializers.IntegerField()
    member_count = serializers.IntegerField()
    rank = serializers.IntegerField()
