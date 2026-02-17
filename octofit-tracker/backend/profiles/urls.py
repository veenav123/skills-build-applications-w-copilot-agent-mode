from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    StudentProfileViewSet,
    GymTeacherProfileViewSet,
    UserRegistrationView
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'student-profiles', StudentProfileViewSet)
router.register(r'teacher-profiles', GymTeacherProfileViewSet)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('', include(router.urls)),
]
