from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
	name = models.CharField(max_length=100, unique=True)
	def __str__(self):
		return self.name

class Activity(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	type = models.CharField(max_length=100)
	duration = models.IntegerField()
	def __str__(self):
		return f"{self.user.username} - {self.type}"

class Leaderboard(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	score = models.IntegerField()
	def __str__(self):
		return f"{self.user.username}: {self.score}"

class Workout(models.Model):
	name = models.CharField(max_length=100)
	difficulty = models.CharField(max_length=50)
	def __str__(self):
		return self.name
