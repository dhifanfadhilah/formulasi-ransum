from django.urls import path
from rest_framework.routers import DefaultRouter
from core.views.formulasi import FormulasiAPIView
from core.views.viewsets import (
    UserViewSet, JenisUnggasViewSet, FaseUnggasViewSet,
    FaseJenisUnggasViewSet, NutrienViewSet, KebutuhanNutrienViewSet,
    BahanPakanViewSet, KandunganNutrienViewSet, BahanFormulasiViewSet,
    FormulasiViewSet
)

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user')
router.register(r'jenis-unggas', JenisUnggasViewSet, basename='jenis-unggas')
router.register(r'fase-unggas', FaseUnggasViewSet, basename='fase-unggas')
router.register(r'fase-jenis-unggas', FaseJenisUnggasViewSet, basename='fase-jenis-unggas')
router.register(r'nutrien', NutrienViewSet, basename='nutrien')
router.register(r'kebutuhan-nutrien', KebutuhanNutrienViewSet, basename='kebutuhan-nutrien')
router.register(r'bahan-pakan', BahanPakanViewSet, basename='bahan-pakan')
router.register(r'kandungan-nutrien', KandunganNutrienViewSet, basename='kandungan-nutrien')
router.register(r'bahan-formulasi', BahanFormulasiViewSet, basename='bahan-formulasi')
router.register(r'hasil-formulasi', FormulasiViewSet, basename='hasil-formulasi')

urlpatterns = router.urls + [
    path('formulasi/', FormulasiAPIView.as_view(), name='formulasi'),
]