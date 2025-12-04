from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PartnerViewSet,
    PartnerContactViewSet,
    PartnershipActivityViewSet,
    all_contacts,
    contacts_by_partner,
    signup_view,
    login_view,
    logout_view,
    current_user,
    UserViewSet,
    college_list,
    department_list,
    get_all_users,
    all_users,
    departments_by_college,
    update_user,
    my_partners,
)
from . import views

# -----------------------------
# Register ViewSets with router
# -----------------------------
router = DefaultRouter()
router.register(r'partners', PartnerViewSet)
router.register(r'partner-contacts', PartnerContactViewSet)
router.register(r'partner-activities', PartnershipActivityViewSet)
router.register(r'users', UserViewSet, basename='user')  # CRUD API

# -----------------------------
# URL Patterns
# -----------------------------
urlpatterns = [
    path("", include(router.urls)),

    # AUTH API ENDPOINTS
    path("signup/", signup_view, name="signup"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("current_user/", current_user, name="current_user"),

    # Colleges & Departments
    path('colleges/', college_list, name='college-list'),
    path('departments/', department_list, name='department-list'),

    # Legacy endpoints (optional)
    path('all_users/', all_users, name='all_users'),
    path("get_all_users/", get_all_users, name="get_all_users"),

    # PENDING USER REQUESTS
    path("pending-users/", views.get_pending_requests, name="pending_users"),
    path("pending-users/<int:user_id>/approve/", views.approve_request, name="approve_request"),
    path("pending-users/<int:user_id>/decline/", views.decline_request, name="decline_request"),

    # DECLINED USERS MANAGEMENT
    path('declined/', views.declined_users_list, name='declined_users'),
    path('declined/<int:pk>/', views.delete_user, name='delete_declined_user'),

    # COLLEGES API
    path("all_colleges_api/", college_list, name="college-list"),
    path("departments_by_college/<int:college_id>/", departments_by_college),
    
    # UPDATE USER INFO
    path("update_user/", update_user, name="update_user"),

    # PARTNERS API
    path("my_partners/", my_partners, name="my_partners"),    

    # BROWSER-FRIENDLY PARTNERS PAGE
    path('all_partners/', views.all_partners_page, name='all_partners_page'),

    # CONTACTS API
    path("contacts/", views.all_contacts, name="all_contacts"),
    path("contacts_by_partner/<int:partner_id>/", views.contacts_by_partner, name="contacts_by_partner"),
]
