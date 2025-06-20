from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from core.serializers import (
    UserSerializer, AdminUpdateUserSerializer, JenisUnggasSerializer, FaseUnggasSerializer,
    FaseJenisUnggasSerializer, NutrienSerializer, KebutuhanNutrienSerializer,
    BahanPakanSerializer, KandunganNutrienSerializer,
    FormulasiSerializer, BahanFormulasiSerializer
)
from core.models import (
    JenisUnggas, FaseUnggas, FaseJenisUnggas,
    Nutrien, KebutuhanNutrien, BahanPakan,
    KandunganNutrien, Formulasi, BahanFormulasi
)
from core.permissions import IsAdminOrSelf, IsAdminOrReadOnly, IsAdmin

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == 'admin':
            return AdminUpdateUserSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['list', 'destroy']:
            return [IsAdmin()]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [IsAdminOrSelf()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.user_type == 'admin':
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if not user.user_type == 'admin' and obj != user:
            raise PermissionDenied("Anda tidak memiliki izin untuk mengakses data ini.")
        return obj
    
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
    queryset = BahanPakan.objects.all().order_by('id')
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['kategori']

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
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['unggas', 'fase']

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

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboardStats(request):
    return Response({
        "total_user": User.objects.count(),
        "total_bahan_pakan": BahanPakan.objects.count(),
        "total_kebutuhan_nutrien": KebutuhanNutrien.objects.count(),
        "total_formulasi": Formulasi.objects.count(),
    })