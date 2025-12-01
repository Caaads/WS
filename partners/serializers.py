from rest_framework import serializers
from .models import Partner, PartnerContact, PartnershipActivity

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

