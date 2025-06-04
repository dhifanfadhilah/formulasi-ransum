from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from core.serializers import RegisterSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from core.serializers import CustomTokenObtainPairSerializer, LogoutSerializer
from core.models import User

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registrasi berhasil"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Link tidak valid'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Verifikasi email berhasil'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'LInk tidak valid atau kadaluwarsa'}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Berhasil logout."}, status=status.HTTP_204_NO_CONTENT)