from django.contrib import admin
from .models import UserProfile, StudentProfile, GymTeacherProfile


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'


class GymTeacherProfileInline(admin.StackedInline):
    model = GymTeacherProfile
    can_delete = False
    verbose_name_plural = 'Gym Teacher Profile'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'created_at']
    list_filter = ['user_type', 'created_at']
    search_fields = ['user__username', 'user__email']
    inlines = []
    
    def get_inline_instances(self, request, obj=None):
        """Conditionally show inlines based on user_type"""
        if obj:
            if obj.user_type == 'student':
                self.inlines = [StudentProfileInline]
            elif obj.user_type == 'teacher':
                self.inlines = [GymTeacherProfileInline]
        return super().get_inline_instances(request, obj)


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'student_id', 'grade_level']
    list_filter = ['grade_level']
    search_fields = ['student_id', 'user_profile__user__username']


@admin.register(GymTeacherProfile)
class GymTeacherProfileAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'employee_id', 'specialization', 'years_of_experience']
    list_filter = ['years_of_experience']
    search_fields = ['employee_id', 'user_profile__user__username', 'specialization']
