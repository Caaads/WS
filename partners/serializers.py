from rest_framework import serializers
from .models import (
    Partner,
    PartnerContact,
    College,
    Department,
    User
)


# -----------------------
# College & Department
# -----------------------


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name')
class CollegeSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)  # nested departments

    class Meta:
        model = College
        fields = ('id', 'name', 'departments')

# Optional nested/read-only variants (kept for clarity)
class CollegeNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']
        

class DepartmentNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


# -----------------------
# Partner Contacts
# -----------------------
class PartnerContactSerializer(serializers.ModelSerializer):
    partner_name = serializers.CharField(source='partner.company', read_only=True)

    class Meta:
        model = PartnerContact
        fields = ['id', 'fullname', 'position', 'email', 'phone', 'partner_name']


# ==========================
# Partner serializer
# ==========================
class PartnerSerializer(serializers.ModelSerializer):
    # Nested read-only college, write via college_id
    college = CollegeNestedSerializer(read_only=True)
    college_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    department = DepartmentNestedSerializer(read_only=True)
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    # Nested contacts (read/write)
    contacts = PartnerContactSerializer(many=True)

## --------------------------
## Full Partner Serializer (for CRUD) NESTED COLLEGE & DEPARTMENT
## --------------------------
    class Meta:
        model = Partner
        fields = [
            "id",
            "company",
            "college",
            "department",
            "college_id",
            "department_id",
            "effectivity_start",
            "effectivity_end",
            "status",
            "contacts",
        ]

    # --------------------------
    # Create and Update for Partner + Contacts 
    # --------------------------
    def create(self, validated_data):
        college_id = validated_data.pop("college_id", None)
        department_id = validated_data.pop("department_id", None)
        contacts_data = validated_data.pop("contacts", [])

        if college_id:
            try:
                validated_data["college"] = College.objects.get(id=college_id)
            except College.DoesNotExist:
                raise serializers.ValidationError({"college_id": "College not found."})

        if department_id:
            try:
                validated_data["department"] = Department.objects.get(id=department_id)
            except Department.DoesNotExist:
                raise serializers.ValidationError({"department_id": "Department not found."})

        partner = Partner.objects.create(**validated_data)

        for contact in contacts_data:
            PartnerContact.objects.create(partner=partner, **contact)
        return partner

    def update(self, instance, validated_data):
        college_id = validated_data.pop("college_id", None)
        department_id = validated_data.pop("department_id", None)
        contacts_data = validated_data.pop("contacts", None)

        if college_id is not None:
            if college_id == "":
                instance.college = None
            else:
                instance.college = College.objects.get(id=college_id)

        if department_id is not None:
            if department_id == "":
                instance.department = None
            else:
                instance.department = Department.objects.get(id=department_id)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if contacts_data is not None:
            instance.contacts.all().delete()
            for contact in contacts_data:
                PartnerContact.objects.create(partner=instance, **contact)

        return instance


# -----------------------
# Full User Serializer (for CRUD)
# -----------------------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # Keep read-only nested details, write via ID fields
    college = CollegeSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    college_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id',
            'fullname',
            'email',
            'role',
            'college',        # read nested
            'college_id',     # write via id
            'department',     # read nested
            'department_id',  # write via id
            'password',
            'is_active',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        college_id = validated_data.pop('college_id', None)
        department_id = validated_data.pop('department_id', None)

        if college_id:
            try:
                validated_data['college'] = College.objects.get(id=college_id)
            except College.DoesNotExist:
                raise serializers.ValidationError({"college_id": "College not found."})

        if department_id:
            try:
                validated_data['department'] = Department.objects.get(id=department_id)
            except Department.DoesNotExist:
                raise serializers.ValidationError({"department_id": "Department not found."})

        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        college_id = validated_data.pop('college_id', None)
        department_id = validated_data.pop('department_id', None)

        if college_id is not None:
            if college_id == "":
                instance.college = None
            else:
                try:
                    instance.college = College.objects.get(id=college_id)
                except College.DoesNotExist:
                    raise serializers.ValidationError({"college_id": "College not found."})

        if department_id is not None:
            if department_id == "":
                instance.department = None
            else:
                try:
                    instance.department = Department.objects.get(id=department_id)
                except Department.DoesNotExist:
                    raise serializers.ValidationError({"department_id": "Department not found."})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


# -----------------------
# Slim User List Serializer (no password)
# -----------------------
class UserListSerializer(serializers.ModelSerializer):
    college = CollegeSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "fullname",
            "email",
            "role",
            "college",
            "department",
        ]
