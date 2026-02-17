from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from datetime import datetime, timedelta
from .models import Activity
from .serializers import ActivitySerializer, ActivityCreateSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Activity.objects.filter(user=self.request.user)
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset
    
    def create(self, request):
        serializer = ActivityCreateSerializer(data=request.data)
        if serializer.is_valid():
            activity = serializer.save(user=request.user)
            activity.calculate_points()
            activity.save()
            
            # Update user's total points
            user_profile = request.user.profile
            user_profile.total_points += activity.points_earned
            user_profile.save()
            
            return Response(
                ActivitySerializer(activity).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        activities = self.get_queryset()
        
        total_activities = activities.count()
        total_points = activities.aggregate(Sum('points_earned'))['points_earned__sum'] or 0
        total_duration = activities.aggregate(Sum('duration_minutes'))['duration_minutes__sum'] or 0
        total_distance = activities.aggregate(Sum('distance_km'))['distance_km__sum'] or 0
        
        # Activities by type
        by_type = activities.values('activity_type').annotate(
            count=Count('_id'),
            total_duration=Sum('duration_minutes')
        )
        
        return Response({
            'total_activities': total_activities,
            'total_points': total_points,
            'total_duration_minutes': total_duration,
            'total_distance_km': round(total_distance, 2) if total_distance else 0,
            'activities_by_type': list(by_type)
        })
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        days = int(request.query_params.get('days', 7))
        start_date = datetime.now().date() - timedelta(days=days)
        activities = Activity.objects.filter(
            user=request.user,
            date__gte=start_date
        )
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

