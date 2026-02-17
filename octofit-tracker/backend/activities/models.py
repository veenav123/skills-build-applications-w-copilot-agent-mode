from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models

class Activity(models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
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
    duration_minutes = models.IntegerField(help_text="Duration in minutes")
    distance_km = models.FloatField(null=True, blank=True, help_text="Distance in kilometers")
    calories_burned = models.IntegerField(null=True, blank=True)
    points_earned = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"

    def calculate_points(self):
        """Calculate points based on activity type and duration"""
        base_points = {
            'running': 10,
            'walking': 5,
            'cycling': 8,
            'swimming': 12,
            'strength_training': 8,
            'yoga': 6,
            'sports': 10,
            'other': 5,
        }
        points_per_minute = base_points.get(self.activity_type, 5)
        self.points_earned = int(self.duration_minutes * points_per_minute / 10)
        return self.points_earned

