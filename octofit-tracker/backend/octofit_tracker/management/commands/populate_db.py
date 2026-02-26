from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from octofit_tracker.models import Team, Activity, Leaderboard, Workout

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        user_objs = {}
        users = [
            {'username': 'ironman', 'email': 'ironman@marvel.com', 'team': marvel},
            {'username': 'captainamerica', 'email': 'cap@marvel.com', 'team': marvel},
            {'username': 'batman', 'email': 'batman@dc.com', 'team': dc},
            {'username': 'superman', 'email': 'superman@dc.com', 'team': dc},
        ]
        for u in users:
            user = User.objects.create_user(username=u['username'], email=u['email'], password='password')
            user_objs[u['username']] = user

        # Create activities
        Activity.objects.create(user=user_objs['ironman'], type='run', duration=30)
        Activity.objects.create(user=user_objs['batman'], type='cycle', duration=45)

        # Create leaderboard
        Leaderboard.objects.create(user=user_objs['ironman'], score=100)
        Leaderboard.objects.create(user=user_objs['batman'], score=90)

        # Create workouts
        Workout.objects.create(name='Pushups', difficulty='Easy')
        Workout.objects.create(name='Squats', difficulty='Medium')

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data.'))
