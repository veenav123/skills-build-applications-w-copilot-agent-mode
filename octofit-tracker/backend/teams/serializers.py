from rest_framework import serializers
from .models import Team
from users.serializers import UserSerializer

class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    captain = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'captain', 'members', 
                  'member_count', 'total_points', 'created_at', 'updated_at']
        read_only_fields = ['_id', 'total_points', 'created_at', 'updated_at']
    
    def get__id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if obj._id else None
    
    def get_member_count(self, obj):
        return obj.get_member_count()

class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['name', 'description']

class TeamMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
