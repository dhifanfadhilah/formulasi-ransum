# Generated by Django 5.2.1 on 2025-06-04 03:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_bahanpakan_max_penggunaan_bahanpakan_min_penggunaan_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('admin', 'Admin'), ('user', 'User')], default='user', max_length=10),
        ),
    ]
