from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .permissions import IsAdminOrSelf

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminOrSelf()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def get_object(self):
        obj = super().get_object()
        if not self.request.user.is_superuser and obj != self.request.user:
            raise PermissionDenied("Anda tidak memiliki izin untuk mengakses data ini.")
        return obj

    def perform_create(self, serializer):
        serializer.save()
