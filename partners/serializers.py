from rest_framework import serializers
from .models import Partner, PartnerContact, PartnershipActivity, College, Department, User

class PartnerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerContact
        fields = "__all__"


class PartnershipActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipActivity
        fields = "__all__"


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = [
            'id', 'company1', 'college1', 'company2', 'college2',
            'contact1_name', 'contact1_email', 'contact1_phone',
            'contact2_name', 'contact2_email', 'contact2_phone',
            'effectivity_start', 'effectivity_end', 'status',
            'created_at', 'updated_at'
        ]

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'college']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'role', 'college', 'department', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user