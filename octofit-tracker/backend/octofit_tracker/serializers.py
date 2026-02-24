from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Activity, Leaderboard, Workout

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'email']

class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ['id', 'name']

class ActivitySerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	class Meta:
		model = Activity
		fields = ['id', 'user', 'type', 'duration']

class LeaderboardSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	class Meta:
		model = Leaderboard
		fields = ['id', 'user', 'score']

class WorkoutSerializer(serializers.ModelSerializer):
	class Meta:
		model = Workout
		fields = ['id', 'name', 'difficulty']
