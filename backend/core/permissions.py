from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrSelf(BasePermission):
    """
    Izinkan superuser atau admin melihat dan mengedit siapa saja,
    user biasa hanya bisa akses data miliknya sendiri.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_superuser or 
            request.user.user_type == 'admin' or
            obj == request.user
        )

class IsAdminOrReadOnly(BasePermission):
    """
    Mengizinkan hanya admin (user_type='admin') untuk mengubah data,
    tetapi mengizinkan siapa pun untuk membaca (GET, HEAD, OPTIONS).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  # Siapa pun bisa baca
        return (
            request.user.is_authenticated
            and request.user.user_type == 'admin'
        )
    
class IsAdmin(BasePermission):
    """
    Izin hanya untuk pengguna dengan user_type = 'admin'
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'admin'