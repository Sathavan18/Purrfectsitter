from django.contrib import admin
from api.views import register_user, update_owner_profile, update_minder_profile, CustomTokenObtainPairSerializer, ReviewCreateView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView




urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/register/', register_user, name='user-register'),
    path("api/token/", TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/update-owner-profile/', update_owner_profile, name='update_owner_profile'),
    path('api/update-minder-profile/', update_minder_profile, name='update_minder_profile'),
    path('api/reviews/', ReviewCreateView.as_view(), name='create-review'),
]
