from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    captain = models.ForeignKey(User, on_delete=models.CASCADE, related_name='captained_teams')
    members = models.ManyToManyField(User, related_name='teams', blank=True)
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teams'
        ordering = ['-total_points', 'name']

    def __str__(self):
        return self.name

    def get_member_count(self):
        return self.members.count()

    def update_total_points(self):
        """Update team's total points based on member activities"""
        from activities.models import Activity
        member_ids = self.members.values_list('id', flat=True)
        total = Activity.objects.filter(user_id__in=member_ids).aggregate(
            total=models.Sum('points_earned')
        )['total'] or 0
        self.total_points = total
        self.save()
        return self.total_points

