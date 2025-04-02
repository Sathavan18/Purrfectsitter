from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import CustomUser, PetOwner, PetMinder, Review
from django.core.exceptions import ObjectDoesNotExist

class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES)
    
    # Fields for owners 
    pet_name = serializers.CharField(required=False, allow_blank=True)
    pet_type = serializers.CharField(required=False, allow_blank=True)
    pet_age = serializers.IntegerField(required=False, allow_null=True)
    breed = serializers.CharField(required=False, allow_blank=True)

    # Fields for minders 
    availability = serializers.JSONField(required=False)  # JSON list of available days
    price_per_day = serializers.DecimalField(max_digits=6, decimal_places=2, required=False)
    experience = serializers.CharField(required=False, allow_blank=True)
    pet_preferences = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password', 'role',
            'pet_name', 'pet_type', 'pet_age', 'breed',  # Owner fields
            'availability', 'price_per_day', 'experience', 'pet_preferences', 'location'  # Minder fields
        ]
        extra_kwargs = {'password': {'write_only': True}}  # Hide password from API response

    def create(self, validated_data):
        role = validated_data.pop('role')  # Extract role from data

        # Check if username already exists 
        if CustomUser.objects.filter(username=validated_data['username']).exists():
            raise ValidationError({"username": "This username is already taken."})
        
        # Check if email already exists 
        if CustomUser.objects.filter(email=validated_data['email']).exists():
            raise ValidationError({"email": "This email is already registered."})

        # Create user 
        user = CustomUser.objects.create_user(**validated_data, role=role)

        # Handle role-specific data 
        if role == 'owner':
            PetOwner.objects.create(
                user=user,
                pet_name=validated_data.get('pet_name', ''),
                pet_type=validated_data.get('pet_type', ''),
                pet_age=validated_data.get('pet_age'),
                breed=validated_data.get('breed', '')
            )
        elif role == 'minder':
            

            PetMinder.objects.create(
                user=user,
                availability = validated_data.get('availability', None),
                price_per_day=validated_data.get('price_per_day', 0.00),
                experience=validated_data.get('experience', ''),
                pet_preferences=validated_data.get('pet_preferences', ''),
                location=validated_data.get('location', '')
            )

        return user

class ReviewSerializer(serializers.ModelSerializer):
    pet_minder_name = serializers.CharField( write_only=True)
    class Meta:
        model = Review
        fields = ['pet_minder_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at'] 
    
    def validate_pet_minder_name(self, value):
        value = value.strip()
        try:
            pet_minder = PetMinder.objects.get(user__username__iexact=value)
            if pet_minder.user == self.context['request'].user:
                raise serializers.ValidationError("You cannot review yourself")
            return pet_minder  # Return the PetMinder instance, not just the name
        except PetMinder.DoesNotExist:
            raise serializers.ValidationError("No pet minder found with this username")

    def create(self, validated_data):

        pet_minder = validated_data.pop('pet_minder_name')  # This is now the PetMinder instance
        return Review.objects.create(
            pet_minder=pet_minder,
            user=self.context['request'].user,
            **validated_data
        )
