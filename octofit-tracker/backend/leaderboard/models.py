from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models

class WorkoutSuggestion(models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    fitness_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ])
    activity_type = models.CharField(max_length=50, choices=[
        ('running', 'Running'),
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('strength_training', 'Strength Training'),
        ('yoga', 'Yoga'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ])
    duration_minutes = models.IntegerField()
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('hard', 'Hard'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workout_suggestions'

    def __str__(self):
        return f"{self.title} ({self.fitness_level})"

