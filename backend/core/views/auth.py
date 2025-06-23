from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from core.serializers import RegisterSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from google.auth.transport import requests
from google.oauth2 import id_token
from core.serializers import (
    CustomTokenObtainPairSerializer, LogoutSerializer, 
    ChangePasswordSerializer, PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer
)
from core.models import User
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Registrasi berhasil"}, status=status.HTTP_201_CREATED)
            print("REGISTER ERROR:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("REGISTER ERROR:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        
class TestEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email wajib diisi'}, status=400)

        subject = "Tes Email dari Django"
        message = "Ini adalah email percobaan dari backend Django kamu."

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False
            )
            return Response({'message': 'Email berhasil dikirim ke ' + email})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLogin(SocialLoginView):
    permission_classes = [AllowAny]
    authentication_classes = []

    adapter_class = GoogleOAuth2Adapter
    callback_url = "postmessage"  # Khusus untuk one-tap login
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        logger.debug("Google Login request body: %s", request.data)
        logger.debug("Google Login request headers: %s", request.headers)

        if 'id_token' in request.data:
            request.data['access_token'] = request.data.pop('id_token')

        try:
            response = super().post(request, *args, **kwargs)
            logger.debug("Google Login response: %s", response.data)
            return response
        except Exception as e:
            logger.error("Google Login error: %s", str(e))
            raise

class CustomGoogleLogin(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            token = request.data.get('id_token')
            if not token:
                return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify the token with Google
            try:
                # Get client ID from settings
                client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
                
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    requests.Request(), 
                    client_id
                )
                
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    return Response({'error': 'Invalid token issuer'}, status=status.HTTP_400_BAD_REQUEST)
                
            except ValueError as e:
                return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            
            email = idinfo.get('email')
            name = idinfo.get('name', '')
            
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create or get user
            with transaction.atomic():
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'name': name,
                        'user_type': 'user',
                        'is_active': True,
                    }
                )
                
                if created:
                    user.set_unusable_password()
                    user.save()
                elif not user.name and name:
                    user.name = name
                    user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'user_type': user.user_type,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Google login error: {str(e)}")
            return Response({'error': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)

class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Berhasil logout."}, status=status.HTTP_204_NO_CONTENT)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password berhasil diubah."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Link reset password berhasil dikirim. Mohon cek email Anda."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        data = request.data.copy()
        data['uidb64'] = uidb64
        data['token'] = token

        serializer = PasswordResetConfirmSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password berhasil diubah."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)