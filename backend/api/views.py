import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes 
from django.contrib.auth import get_user_model 
from .models import PetOwner, PetMinder, Review
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import ReviewSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Ensure the role is added to the token
        data["role"] = self.user.role  # Assuming 'role' is a field in your User model

        return data

        
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print("Request Data:", json.dumps(request.data, indent=2))  # Log incoming request data for debugging

    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    # Ensure all required fields are provided
    if not all([first_name, last_name, username, email, password, role]):
        return Response({"error": "All fields (firstName, lastName, username, email, password, role) are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create the user
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            password=password 
        )

        # Set the role of the user (after creation)
        user.role = role
        user.save()  # Save the user after assigning the role

        # Create associated profile (without pet details for now)
        if role == 'owner':
            PetOwner.objects.create(user=user)
        elif role == 'minder':
            PetMinder.objects.create(user=user)

        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error during user creation: {str(e)}")  # Log the actual exception
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensures only authenticated users can access this endpoint
def update_owner_profile(request):
    user = request.user

    # Ensure the user is a pet owner
    try:
        pet_owner = PetOwner.objects.get(user=user)
    except PetOwner.DoesNotExist:
        return Response({"error": "Pet owner profile not found."}, status=status.HTTP_404_NOT_FOUND)

    # Collect pet details from the request
    pet_name = request.data.get('pet_name')
    pet_type = request.data.get('pet_type')
    pet_age = request.data.get('pet_age')
    breed = request.data.get('breed')

    # Update the pet owner profile
    pet_owner.pet_name = pet_name
    pet_owner.pet_type = pet_type
    pet_owner.pet_age = pet_age
    if pet_type == 'dog':
        pet_owner.breed = breed
    else:
        pet_owner.breed = None  # Clear breed if not a dog

    pet_owner.save()

    return Response({"message": "Pet profile updated successfully!"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_minder_profile(request):
    user = request.user  # Get the logged-in user
    
    if not user.is_authenticated:
        return Response({"error": "You must be logged in to update your profile."}, status=400)

    if user.role != 'minder':
        return Response({"error": "You must be a minder to update this profile."}, status=400)

    # Update minder details
    availability = request.data.get('availability', [])
    price_per_day = request.data.get('price_per_day', 0.00)
    experience = request.data.get('experience', '')
    pet_preferences = request.data.get('pet_preferences', '')
    location = request.data.get('location', '')

    # Assuming that you already have a PetMinder model linked to CustomUser
    pet_minder = PetMinder.objects.get(user=user)
    pet_minder.availability = availability
    pet_minder.price_per_day = price_per_day
    pet_minder.experience = experience
    pet_minder.pet_preferences = pet_preferences
    pet_minder.location = location
    
    pet_minder.save()

    return Response({"message": "Minder profile updated successfully."}, status=200)

class ReviewCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

   
    def perform_create(self, serializer):
        serializer.save()