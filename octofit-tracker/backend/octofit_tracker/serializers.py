from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Activity, Leaderboard, Workout

class UserSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	class Meta:
		model = User
		fields = ['id', 'username', 'email']

class TeamSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	class Meta:
		model = Team
		fields = ['id', 'name']

class ActivitySerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	user = serializers.SlugRelatedField(read_only=True, slug_field='username')
	class Meta:
		model = Activity
		fields = ['id', 'user', 'type', 'duration']

class LeaderboardSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	user = serializers.SlugRelatedField(read_only=True, slug_field='username')
	class Meta:
		model = Leaderboard
		fields = ['id', 'user', 'score']

class WorkoutSerializer(serializers.ModelSerializer):
	id = serializers.CharField(read_only=True)
	class Meta:
		model = Workout
		fields = ['id', 'name', 'difficulty']
