from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, StudentProfile, GymTeacherProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for Django User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for StudentProfile model"""
    class Meta:
        model = StudentProfile
        fields = ['id', 'grade_level', 'student_id', 'fitness_goals', 'preferred_activities']
        read_only_fields = ['id']


class GymTeacherProfileSerializer(serializers.ModelSerializer):
    """Serializer for GymTeacherProfile model"""
    class Meta:
        model = GymTeacherProfile
        fields = ['id', 'employee_id', 'specialization', 'years_of_experience', 'certification']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model with nested user data"""
    user = UserSerializer(read_only=True)
    student_profile = StudentProfileSerializer(read_only=True, required=False)
    teacher_profile = GymTeacherProfileSerializer(read_only=True, required=False)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'user_type', 'avatar', 'bio', 'created_at', 'updated_at', 
                  'student_profile', 'teacher_profile']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with profile type"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, required=True)
    
    # Student-specific fields
    grade_level = serializers.IntegerField(required=False, allow_null=True)
    student_id = serializers.CharField(required=False, allow_null=True)
    fitness_goals = serializers.CharField(required=False, allow_blank=True)
    preferred_activities = serializers.CharField(required=False, allow_blank=True)
    
    # Teacher-specific fields
    employee_id = serializers.CharField(required=False, allow_null=True)
    specialization = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False, allow_null=True, default=0)
    certification = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name',
                  'user_type', 'grade_level', 'student_id', 'fitness_goals', 'preferred_activities',
                  'employee_id', 'specialization', 'years_of_experience', 'certification']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        user_type = attrs.get('user_type')
        
        # Validate student-specific required fields
        if user_type == 'student':
            if not attrs.get('student_id'):
                raise serializers.ValidationError({"student_id": "Student ID is required for students."})
            if not attrs.get('grade_level'):
                raise serializers.ValidationError({"grade_level": "Grade level is required for students."})
        
        # Validate teacher-specific required fields
        if user_type == 'teacher':
            if not attrs.get('employee_id'):
                raise serializers.ValidationError({"employee_id": "Employee ID is required for teachers."})
        
        return attrs
    
    def create(self, validated_data):
        # Extract profile-specific data
        user_type = validated_data.pop('user_type')
        validated_data.pop('password2')
        
        # Student fields
        grade_level = validated_data.pop('grade_level', None)
        student_id = validated_data.pop('student_id', None)
        fitness_goals = validated_data.pop('fitness_goals', '')
        preferred_activities = validated_data.pop('preferred_activities', '')
        
        # Teacher fields
        employee_id = validated_data.pop('employee_id', None)
        specialization = validated_data.pop('specialization', '')
        years_of_experience = validated_data.pop('years_of_experience', 0)
        certification = validated_data.pop('certification', '')
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Update the auto-created profile with the correct user_type
        user_profile = user.profile
        user_profile.user_type = user_type
        user_profile.save()
        
        # Create type-specific profile
        if user_type == 'student':
            StudentProfile.objects.create(
                user_profile=user_profile,
                grade_level=grade_level,
                student_id=student_id,
                fitness_goals=fitness_goals,
                preferred_activities=preferred_activities
            )
        elif user_type == 'teacher':
            GymTeacherProfile.objects.create(
                user_profile=user_profile,
                employee_id=employee_id,
                specialization=specialization,
                years_of_experience=years_of_experience,
                certification=certification
            )
        
        return user
