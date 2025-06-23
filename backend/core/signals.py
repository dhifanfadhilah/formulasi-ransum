from allauth.account.signals import user_signed_up
from django.dispatch import receiver

@receiver(user_signed_up)
def activate_user_social_login(request, user, **kwargs):
    user.is_active = True
    user.save()
