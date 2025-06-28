from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.serializers import FormulasiInputSerializer, SimpanFormulasiSerializer
from core.models import BahanPakan, Formulasi, BahanFormulasi
from core.utils.formulasi import formulasi_lp
from django.utils.timezone import now

class FormulasiAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = FormulasiInputSerializer(data=request.data)
        if serializer.is_valid():
            jenis_unggas = serializer.validated_data['jenis_unggas']
            fase = serializer.validated_data['fase']
            bahan_pakan_objs = serializer.validated_data['bahan_pakan_ids']

            hasil = formulasi_lp(jenis_unggas, fase, list(bahan_pakan_objs))
            
            if hasil['status'] == 'success':
                return Response({
                    'message': 'Formulasi berhasil dihitung',
                    'data': {
                        'jenis_unggas': {
                            'id': jenis_unggas.id,
                            'nama': jenis_unggas.nama
                        },
                        'fase':{
                            'id': fase.id,
                            'nama': fase.nama
                        },
                        'komposisi': hasil['komposisi'],
                        'total_biaya': hasil['total_biaya'],
                        'kandungan_nutrien': hasil['kandungan_nutrien'],
                        'created_at': now().isoformat()
                    }
                }, status=status.HTTP_200_OK)
            else:
                print(hasil['message'])
                return Response({'error': hasil['message']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SimpanFormulasiAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SimpanFormulasiSerializer(data=request.data)
        print("DEBUG PAYLOAD:", request.data)

        if serializer.is_valid():
            print(serializer.validated_data) 
            nama_formulasi = serializer.validated_data['nama_formulasi']
            unggas = serializer.validated_data['jenis_unggas']
            fase = serializer.validated_data['fase']
            komposisi = serializer.validated_data['komposisi']
            kandungan_nutrien = serializer.validated_data['kandungan_nutrien']

            # Simpan formulasi
            formulasi = Formulasi.objects.create(
                user=request.user,
                nama_formulasi=nama_formulasi,
                unggas=unggas,
                fase=fase,
                formulasi=komposisi,
                kandungan_nutrien=kandungan_nutrien
            )

            # Simpan masing-masing bahan formulasi
            for item in komposisi:
                BahanFormulasi.objects.create(
                    formulasi=formulasi,
                    bahan_pakan_id=item['bahan_pakan_id'],
                    jumlah=item['jumlah']
                )

            return Response({'message': 'Formulasi berhasil disimpan'}, status=201)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)