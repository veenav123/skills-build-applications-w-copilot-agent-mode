from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import UserProfile, StudentProfile, GymTeacherProfile
from .serializers import (
    UserProfileSerializer, 
    StudentProfileSerializer, 
    GymTeacherProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """API endpoint for user registration"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return the created user profile
        profile_serializer = UserProfileSerializer(user.profile)
        return Response(profile_serializer.data, status=status.HTTP_201_CREATED)


class UserProfileViewSet(viewsets.ModelViewSet):
    """API endpoint for user profiles"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter profiles - users can only see their own unless they're staff"""
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's profile"""
        try:
            profile = request.user.profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def students(self, request):
        """Get all student profiles (for teachers)"""
        student_profiles = UserProfile.objects.filter(user_type='student')
        serializer = self.get_serializer(student_profiles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def teachers(self, request):
        """Get all teacher profiles"""
        teacher_profiles = UserProfile.objects.filter(user_type='teacher')
        serializer = self.get_serializer(teacher_profiles, many=True)
        return Response(serializer.data)


class StudentProfileViewSet(viewsets.ModelViewSet):
    """API endpoint for student-specific profile data"""
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter profiles - users can only see their own unless they're staff"""
        if self.request.user.is_staff:
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user_profile__user=self.request.user)


class GymTeacherProfileViewSet(viewsets.ModelViewSet):
    """API endpoint for teacher-specific profile data"""
    queryset = GymTeacherProfile.objects.all()
    serializer_class = GymTeacherProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter profiles - users can only see their own unless they're staff"""
        if self.request.user.is_staff:
            return GymTeacherProfile.objects.all()
        return GymTeacherProfile.objects.filter(user_profile__user=self.request.user)
