from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    UserSerializer, JenisUnggasSerializer, FaseUnggasSerializer,
    FaseJenisUnggasSerializer, NutrienSerializer, KebutuhanNutrienSerializer,
    BahanPakanSerializer, KandunganNutrienSerializer,
    FormulasiSerializer, BahanFormulasiSerializer
)
from .models import (
    JenisUnggas, FaseUnggas, FaseJenisUnggas,
    Nutrien, KebutuhanNutrien, BahanPakan,
    KandunganNutrien, Formulasi, BahanFormulasi
)
from .permissions import IsAdminOrSelf, IsAdminOrReadOnly

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

class JenisUnggasViewSet(viewsets.ModelViewSet):
    serializer_class = JenisUnggasSerializer
    queryset = JenisUnggas.objects.all()
    permission_classes = [IsAdminOrReadOnly]

class FaseUnggasViewSet(viewsets.ModelViewSet):
    serializer_class = FaseUnggasSerializer
    queryset = FaseUnggas.objects.all()
    permission_classes = [IsAdminOrReadOnly]

class FaseJenisUnggasViewSet(viewsets.ModelViewSet):
    serializer_class = FaseJenisUnggasSerializer
    queryset = FaseJenisUnggas.objects.select_related('jenis_unggas', 'fase').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['jenis_unggas']
    
class NutrienViewSet(viewsets.ModelViewSet):
    serializer_class = NutrienSerializer
    queryset = Nutrien.objects.all()
    permission_classes = [IsAdminOrReadOnly]

class KebutuhanNutrienViewSet(viewsets.ModelViewSet):
    serializer_class = KebutuhanNutrienSerializer
    queryset = KebutuhanNutrien.objects.select_related('jenis_unggas', 'fase', 'nutrien').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['jenis_unggas', 'fase']

class BahanPakanViewSet(viewsets.ModelViewSet):
    serializer_class = BahanPakanSerializer
    queryset = BahanPakan.objects.all()
    permission_classes = [IsAdminOrReadOnly]

class KandunganNutrienViewSet(viewsets.ModelViewSet):
    serializer_class = KandunganNutrienSerializer
    queryset = KandunganNutrien.objects.select_related('bahan_pakan', 'nutrien').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['bahan_pakan']

class BahanFormulasiViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BahanFormulasiSerializer
    queryset = BahanFormulasi.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['formulasi']

class FormulasiViewSet(viewsets.ModelViewSet):
    queryset = Formulasi.objects.all()
    serializer_class = FormulasiSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Admin dapat melihat semua formulasi
        if user.is_authenticated and user.user_type == 'admin':
            return Formulasi.objects.all()
        # User hanya bisa melihat formulasi miliknya
        elif user.is_authenticated:
            return Formulasi.objects.filter(user=user)
        # Pengguna tidak login tidak boleh lihat apa-apa
        return Formulasi.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("Anda harus login untuk menyimpan formulasi.")
        serializer.save(user=user)