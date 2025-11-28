from rest_framework import viewsets
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

from .models import Partner, User
from .serializers import PartnerSerializer


# -----------------------------
# Partner API
# -----------------------------
class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer


# -----------------------------
# Basic pages / current user
# -----------------------------
def home(request):
    return HttpResponse("Welcome to the OSA Partnership Monitoring System!")


def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "id": request.user.id,
            "email": request.user.email,
            "fullname": getattr(request.user, "fullname", ""),
            "role": request.user.role,
            "position": getattr(request.user, "position", "")
        })
    return JsonResponse({"error": "Not logged in"}, status=401)



# -----------------------------
# Authentication: Signup
# -----------------------------
@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Invalid method"}, status=400)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        fullname = data.get("fullname", "")
        position = data.get("position", "")

        if User.objects.filter(email=email).exists():
            return JsonResponse({"success": False, "error": "User already exists"})

        user = User.objects.create_user(
            email=email,
            password=password,
            fullname=fullname,
            position=position
        )

        return JsonResponse({"success": True})

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})


# -----------------------------
# Authentication: Login
# -----------------------------
@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Invalid method"}, status=400)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user = authenticate(request, username=email, password=password)


        if user:
            login(request, user)
            return JsonResponse({
                "success": True,
                "id": user.id,
                "email": user.email,
                "fullname": user.fullname,
                "role": user.role,
                "position": getattr(user, "position", "")
            })

        return JsonResponse({"success": False, "error": "Invalid credentials"})

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})


# -----------------------------
# Authentication: Logout
# -----------------------------
@api_view(["GET", "POST"])
def logout_view(request):
    """
    Logs the user out by clearing the session.
    GET allowed so the user can also visit /logout/ manually for testing.
    """
    logout(request)  # destroys session
    return Response({"success": True, "message": "Logged out"}, status=200)