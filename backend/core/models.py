from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# User Model
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email harus diisi')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True)
    user_type = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('user', 'User')])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

# Jenis & Fase Unggas
class JenisUnggas(models.Model):
    nama = models.CharField(max_length=50)

    def __str__(self):
        return self.nama


class FaseUnggas(models.Model):
    nama = models.CharField(max_length=255)

    def __str__(self):
        return self.nama

# Bahan Pakan
class BahanPakan(models.Model):
    nama = models.CharField(max_length=100)
    harga = models.DecimalField(max_digits=10, decimal_places=2)
    kadar_air = models.DecimalField(max_digits=5, decimal_places=2)
    bahan_kering = models.DecimalField(max_digits=5, decimal_places=2)
    abu = models.DecimalField(max_digits=5, decimal_places=2)
    protein_kasar = models.DecimalField(max_digits=5, decimal_places=2)
    lemak_kasar = models.DecimalField(max_digits=5, decimal_places=2)
    serat_kasar = models.DecimalField(max_digits=5, decimal_places=2)
    betn = models.DecimalField(max_digits=5, decimal_places=2)
    energi_metabolisme = models.DecimalField(max_digits=10, decimal_places=2)
    calsium = models.DecimalField(max_digits=5, decimal_places=2)
    posfor_total = models.DecimalField(max_digits=5, decimal_places=2)
    posfor_tersedia = models.DecimalField(max_digits=5, decimal_places=2)
    lys = models.DecimalField(max_digits=5, decimal_places=2)
    met = models.DecimalField(max_digits=5, decimal_places=2)
    met_sis = models.DecimalField(max_digits=5, decimal_places=2)
    tre = models.DecimalField(max_digits=5, decimal_places=2)
    trypt = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nama
    
# Kebutuhan Nutrien
class KebutuhanNutrien(models.Model):
    jenis_unggas = models.ForeignKey(JenisUnggas, on_delete=models.CASCADE)
    fase = models.ForeignKey(FaseUnggas, on_delete=models.CASCADE)

    bk_min = models.DecimalField(max_digits=5, decimal_places=2)
    bk_max = models.DecimalField(max_digits=5, decimal_places=2)
    abu_min = models.DecimalField(max_digits=5, decimal_places=2)
    abu_max = models.DecimalField(max_digits=5, decimal_places=2)
    pk_min = models.DecimalField(max_digits=5, decimal_places=2)
    pk_max = models.DecimalField(max_digits=5, decimal_places=2)
    lk_min = models.DecimalField(max_digits=5, decimal_places=2)
    lk_max = models.DecimalField(max_digits=5, decimal_places=2)
    sk_min = models.DecimalField(max_digits=5, decimal_places=2)
    sk_max = models.DecimalField(max_digits=5, decimal_places=2)
    betn_min = models.DecimalField(max_digits=5, decimal_places=2)
    betn_max = models.DecimalField(max_digits=5, decimal_places=2)
    me_min = models.DecimalField(max_digits=10, decimal_places=2)
    me_max = models.DecimalField(max_digits=10, decimal_places=2)
    ca_min = models.DecimalField(max_digits=5, decimal_places=2)
    ca_max = models.DecimalField(max_digits=5, decimal_places=2)
    p_total_min = models.DecimalField(max_digits=5, decimal_places=2)
    p_total_max = models.DecimalField(max_digits=5, decimal_places=2)
    p_tersedia_min = models.DecimalField(max_digits=5, decimal_places=2)
    p_tersedia_max = models.DecimalField(max_digits=5, decimal_places=2)
    lys_min = models.DecimalField(max_digits=5, decimal_places=2)
    lys_max = models.DecimalField(max_digits=5, decimal_places=2)
    met_min = models.DecimalField(max_digits=5, decimal_places=2)
    met_max = models.DecimalField(max_digits=5, decimal_places=2)
    met_sis_min = models.DecimalField(max_digits=5, decimal_places=2)
    met_sis_max = models.DecimalField(max_digits=5, decimal_places=2)
    tre_min = models.DecimalField(max_digits=5, decimal_places=2)
    tre_max = models.DecimalField(max_digits=5, decimal_places=2)
    trypt_min = models.DecimalField(max_digits=5, decimal_places=2)
    trypt_max = models.DecimalField(max_digits=5, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

# Formulasi & Bahan Formulasi
class Formulasi(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    unggas = models.ForeignKey(JenisUnggas, on_delete=models.CASCADE)
    fase = models.ForeignKey(FaseUnggas, on_delete=models.CASCADE)
    formulasi = models.JSONField()
    total_harga = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class BahanFormulasi(models.Model):
    formulasi = models.ForeignKey(Formulasi, on_delete=models.CASCADE, related_name='bahan_formulasi')
    bahan_pakan = models.ForeignKey(BahanPakan, on_delete=models.CASCADE)
    jumlah = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.bahan_pakan.nama} - {self.jumlah} kg"