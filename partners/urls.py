from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet
from . import views
from .views import logout_view

router = DefaultRouter()
router.register(r'partners', PartnerViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('current_user/', views.current_user, name='current_user'),
    path("logout/", logout_view),  
]