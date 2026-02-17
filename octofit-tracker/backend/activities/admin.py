from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'duration_minutes', 'points_earned', 'date', 'created_at']
    list_filter = ['activity_type', 'date', 'created_at']
    search_fields = ['user__username', 'activity_type', 'notes']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'

