from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from core.serializers import FormulasiInputSerializer
from core.models import BahanPakan
from core.utils.formulasi import formulasi_lp


class FormulasiAPIView(APIView):
    def post(self, request):
        serializer = FormulasiInputSerializer(data=request.data)
        if serializer.is_valid():
            jenis_unggas = serializer.validated_data['jenis_unggas']
            fase = serializer.validated_data['fase']
            bahan_pakan_ids = serializer.validated_data['bahan_pakan_ids']

            bahan_pakan_objs = BahanPakan.objects.filter(id__in=bahan_pakan_ids)
            if len(bahan_pakan_objs) != len(bahan_pakan_ids):
                return Response({'error': 'Beberapa Bahan pakan tidak ditemukan'}, status=status.HTTP_400_BAD_REQUEST)

            hasil = formulasi_lp(jenis_unggas, fase, list(bahan_pakan_objs))
            
            if hasil['status'] == 'success':
                return Response({
                    'message': 'Formulasi berhasil dihitung',
                    'data': hasil
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': hasil['message']}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
