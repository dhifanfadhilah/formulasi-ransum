from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    JenisUnggas, FaseUnggas, FaseJenisUnggas,
    BahanPakan, Nutrien, KandunganNutrien,
    KebutuhanNutrien, Formulasi, BahanFormulasi
)

User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone_number', 'password', 'user_type', 'is_active', 'created_at']
        read_only_fields = ['is_active', 'created_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()
        return user
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password harus memiliki minimal 8 karakter")
        return value

# Jenis Unggas
class JenisUnggasSerializer(serializers.ModelSerializer):
    class Meta:
        model = JenisUnggas
        fields = '__all__'

# Fase Unggas
class FaseUnggasSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseUnggas
        fields = '__all__'

# FaseJenisUnggas
class FaseJenisUnggasSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaseJenisUnggas
        fields = '__all__'

# Nutrien
class NutrienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrien
        fields = '__all__'

# Bahan Pakan
class BahanPakanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BahanPakan
        fields = '__all__'

    def validate_harga(self, value):
        if value < 0:
            raise serializers.ValidationError("Harga tidak boleh negatif")
        return value

# Kandungan Nutrien
class KandunganNutrienSerializer(serializers.ModelSerializer):
    nutrien = NutrienSerializer(read_only=True)

    class Meta:
        model = KandunganNutrien
        fields = '__all__'

    def validate_nilai(self, value):
        if value < 0:
            raise serializers.ValidationError("Nilai tidak boleh negatif")
        return value

# Kebutuhan Nutrien
class KebutuhanNutrienSerializer(serializers.ModelSerializer):
    nutrien = NutrienSerializer(read_only=True)

    class Meta:
        model = KebutuhanNutrien
        fields = '__all__'

    def validate_min_value(self, value):
        if value < 0:
            raise serializers.ValidationError("Nilai tidak boleh negatif")
        return value
    
    def validate_max_value(self, value):
        if value < 0:
            raise serializers.ValidationError("Nilai tidak boleh negatif")
        return value

# Bahan Formulasi
class BahanFormulasiSerializer(serializers.ModelSerializer):
    bahan_pakan = BahanPakanSerializer(read_only=True)

    class Meta:
        model = BahanFormulasi
        fields = '__all__'

# Formulasi
class FormulasiSerializer(serializers.ModelSerializer):
    bahan_formulasi = BahanFormulasiSerializer(many=True, read_only=True)
    unggas = JenisUnggasSerializer(read_only=True)
    fase = FaseUnggasSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Formulasi
        fields = '__all__'
