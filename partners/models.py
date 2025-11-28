from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# -----------------------------
# Custom User Manager
# -----------------------------
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, fullname="", role="partner", position="", **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, fullname=fullname, role=role, position=position, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email=email, password=password, role="admin", **extra_fields)

# -----------------------------
# Custom User Model
# -----------------------------
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("staff", "Staff"),
        ("partner", "Partner"),
    )

    email = models.EmailField(unique=True)
    fullname = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="partner")
    position = models.CharField(max_length=255, blank=True)
    username = None
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # email is required, no username

    def __str__(self):
        return self.email

# -----------------------------
# Other Models
# -----------------------------
class Department(models.Model):
    name = models.CharField(max_length=100)

class Partner(models.Model):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    address = models.TextField()
    contact_person = models.CharField(max_length=255)
    manager = models.CharField(max_length=255)
    supervisor1 = models.CharField(max_length=255, null=True, blank=True)
    supervisor2 = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField()
    contact_numbers = models.CharField(max_length=255)
    effectivity_start = models.DateField()
    effectivity_end = models.DateField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name
