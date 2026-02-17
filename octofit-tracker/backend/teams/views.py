from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Team
from .serializers import TeamSerializer, TeamCreateSerializer, TeamMemberSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Team.objects.all()
        
        # Filter by member if requested
        if self.request.query_params.get('my_teams'):
            queryset = queryset.filter(members=self.request.user)
        
        return queryset
    
    def create(self, request):
        serializer = TeamCreateSerializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save(captain=request.user)
            team.members.add(request.user)
            team.save()
            return Response(
                TeamSerializer(team).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        team = self.get_object()
        if request.user in team.members.all():
            return Response(
                {'message': 'You are already a member of this team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        team.members.add(request.user)
        team.update_total_points()
        return Response(
            TeamSerializer(team).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        team = self.get_object()
        if request.user == team.captain:
            return Response(
                {'message': 'Team captain cannot leave the team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.user not in team.members.all():
            return Response(
                {'message': 'You are not a member of this team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        team.members.remove(request.user)
        team.update_total_points()
        return Response(
            {'message': 'Left team successfully'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        if request.user != team.captain:
            return Response(
                {'message': 'Only team captain can add members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(id=serializer.validated_data['user_id'])
                if user in team.members.all():
                    return Response(
                        {'message': 'User is already a member'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                team.members.add(user)
                team.update_total_points()
                return Response(
                    TeamSerializer(team).data,
                    status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                return Response(
                    {'message': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def refresh_points(self, request, pk=None):
        team = self.get_object()
        team.update_total_points()
        return Response(
            TeamSerializer(team).data,
            status=status.HTTP_200_OK
        )

