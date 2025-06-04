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
    user_type = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('user', 'User')], default='user')
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

# Jenis & Fase Unggas
class JenisUnggas(models.Model):
    nama = models.CharField(max_length=50)
    fase = models.ManyToManyField('FaseUnggas', through='FaseJenisUnggas')

    def __str__(self):
        return self.nama


class FaseUnggas(models.Model):
    nama = models.CharField(max_length=255)

    def __str__(self):
        return self.nama

class FaseJenisUnggas(models.Model):
    jenis_unggas = models.ForeignKey(JenisUnggas, on_delete=models.CASCADE)
    fase = models.ForeignKey(FaseUnggas, on_delete=models.CASCADE)
    urutan = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('jenis_unggas', 'fase')
        ordering = ['urutan']

    def __str__(self):
        return f"{self.jenis_unggas.nama} - {self.fase.nama} (Urutan: {self.urutan})"

# Bahan Pakan
class BahanPakan(models.Model):
    KATEGORI_CHOICES = [
        ('energi', 'Sumber Energi'),
        ('protein', 'Sumber Protein'),
        ('mineral', 'Mineral & Prefix'),
    ]

    nama = models.CharField(max_length=100)
    harga = models.DecimalField(max_digits=10, decimal_places=2)
    kategori = models.CharField(
        max_length=20,
        choices=KATEGORI_CHOICES,
        default='energi',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    min_penggunaan = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    max_penggunaan = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    prioritas = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.nama

class Nutrien(models.Model):
    kode = models.CharField(max_length=20)
    nama = models.CharField(max_length=100)
    satuan = models.CharField(max_length=50)

    def __str__(self):
        return self.nama

class KandunganNutrien(models.Model):
    bahan_pakan = models.ForeignKey(BahanPakan, on_delete=models.CASCADE, related_name='kandungan_nutrien')
    nutrien = models.ForeignKey(Nutrien, on_delete=models.CASCADE)
    nilai = models.DecimalField(max_digits=10, decimal_places=3)

    class Meta:
        unique_together = ('bahan_pakan', 'nutrien')

    def __str__(self):
        return f"{self.bahan_pakan.nama} - {self.nutrien.nama}: {self.nilai}"
    
# Kebutuhan Nutrien
class KebutuhanNutrien(models.Model):
    jenis_unggas = models.ForeignKey(JenisUnggas, on_delete=models.CASCADE)
    fase = models.ForeignKey(FaseUnggas, on_delete=models.CASCADE)
    nutrien = models.ForeignKey(Nutrien, on_delete=models.CASCADE)
    min_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ('jenis_unggas', 'fase', 'nutrien')

    def __str__(self):
        return f"{self.jenis_unggas} - {self.fase} - {self.nutrien.nama}"

# Formulasi & Bahan Formulasi
class Formulasi(models.Model):
    nama_formulasi = models.CharField(max_length=100, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    unggas = models.ForeignKey(JenisUnggas, on_delete=models.CASCADE)
    fase = models.ForeignKey(FaseUnggas, on_delete=models.CASCADE)
    formulasi = models.JSONField()
    total_harga = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


class BahanFormulasi(models.Model):
    formulasi = models.ForeignKey(Formulasi, on_delete=models.CASCADE, related_name='bahan_formulasi')
    bahan_pakan = models.ForeignKey(BahanPakan, on_delete=models.CASCADE)
    jumlah = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.bahan_pakan.nama} - {self.jumlah} kg"