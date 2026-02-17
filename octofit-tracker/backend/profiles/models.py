from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Base profile model that extends Django's User model"""
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Gym Teacher'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"
    
    class Meta:
        ordering = ['-created_at']


class StudentProfile(models.Model):
    """Extended profile information specific to students"""
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='student_profile')
    grade_level = models.IntegerField(help_text="Grade level (9-12)")
    student_id = models.CharField(max_length=20, unique=True)
    fitness_goals = models.TextField(blank=True, help_text="Personal fitness goals")
    preferred_activities = models.CharField(max_length=200, blank=True, help_text="Comma-separated list of preferred activities")
    
    def __str__(self):
        return f"Student: {self.user_profile.user.username}"
    
    class Meta:
        ordering = ['grade_level', 'student_id']


class GymTeacherProfile(models.Model):
    """Extended profile information specific to gym teachers"""
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='teacher_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    specialization = models.CharField(max_length=100, blank=True, help_text="e.g., Basketball, Swimming, Fitness Training")
    years_of_experience = models.IntegerField(default=0)
    certification = models.CharField(max_length=200, blank=True, help_text="Professional certifications")
    
    def __str__(self):
        return f"Teacher: {self.user_profile.user.username}"
    
    class Meta:
        ordering = ['employee_id']


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create a UserProfile when a User is created"""
    if created:
        # Create a basic UserProfile - user_type will need to be set separately
        UserProfile.objects.create(user=instance, user_type='student')
