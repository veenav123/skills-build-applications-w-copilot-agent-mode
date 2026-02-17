from django.contrib import admin
from .models import WorkoutSuggestion

@admin.register(WorkoutSuggestion)
class WorkoutSuggestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'fitness_level', 'activity_type', 'difficulty', 'duration_minutes', 'created_at']
    list_filter = ['fitness_level', 'activity_type', 'difficulty', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']

