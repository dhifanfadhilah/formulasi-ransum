from rest_framework.permissions import BasePermission

class IsAdminOrSelf(BasePermission):
    """
    Izinkan superuser melihat dan mengedit siapa saja,
    user biasa hanya bisa akses data miliknya sendiri.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj == request.user
