from django.contrib import admin
from .models import Team

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'captain', 'total_points', 'get_member_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'captain__username', 'description']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['members']

