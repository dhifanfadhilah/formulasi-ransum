from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count
from core.models import BahanLogFormulasi, BahanPakan, KebutuhanNutrien, LogFormulasiSession
from core.permissions import IsAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdmin])
def statistik_bahan_pakan(request):
    data = (
        BahanLogFormulasi.objects
        .values('bahan_pakan__nama', 'bahan_pakan__kategori')
        .annotate(total_digunakan=Count('id'))
        .order_by('-total_digunakan')
    )

    results = [
        {
            "nama": item['bahan_pakan__nama'],
            "kategori": item['bahan_pakan__kategori'],
            "jumlah": item['total_digunakan']
        }
        for item in data
    ]
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAdmin])
def dashboardStats(request):
    return Response({
        "total_user": User.objects.count(),
        "total_bahan_pakan": BahanPakan.objects.count(),
        "total_kebutuhan_nutrien": KebutuhanNutrien.objects.count(),
        "total_formulasi": LogFormulasiSession.objects.count(),
    })