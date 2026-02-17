from rest_framework import serializers
from .models import Activity
from users.serializers import UserSerializer

class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['_id', 'user', 'username', 'activity_type', 'duration_minutes',
                  'distance_km', 'calories_burned', 'points_earned', 'notes',
                  'date', 'created_at']
        read_only_fields = ['_id', 'points_earned', 'created_at']
    
    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None
    
    def create(self, validated_data):
        activity = Activity(**validated_data)
        activity.calculate_points()
        activity.save()
        
        # Update user's total points
        user_profile = activity.user.profile
        user_profile.total_points += activity.points_earned
        user_profile.save()
        
        return activity

class ActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['activity_type', 'duration_minutes', 'distance_km', 
                  'calories_burned', 'notes', 'date']
