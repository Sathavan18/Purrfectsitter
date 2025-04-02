# api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model
from django.utils import timezone


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('owner', 'Pet Owner'),
        ('minder', 'Pet Minder'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class PetOwner(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pet_name = models.CharField(max_length=100, blank=True, null=True)
    pet_type = models.CharField(max_length=50, blank=True, null=True)  # e.g., dog, cat, etc.
    pet_age = models.PositiveIntegerField(blank=True, null=True)
    breed = models.CharField(max_length=100, blank=True, null=True)  # For dog breeds

    def __str__(self):
        return f"{self.user.username}'s Pet Profile"

User = get_user_model()

class PetMinder(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    availability = models.TextField(blank=True, default="[]")  # Store as JSON string
    price_per_day = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    experience = models.TextField(blank=True)
    pet_preferences = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    

    def set_availability(self, value):
        self.availability = json.dumps(value)  # Convert list to JSON string

    def get_availability(self):
        return json.loads(self.availability)  # Convert JSON string to list

    def __str__(self):
        return f"Pet Minder: {self.user.username}"
    

    def __str__(self):
        return f"{self.user.username} - {self.price_per_day}/day"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner_bookings")
    minder = models.ForeignKey(PetMinder, on_delete=models.CASCADE, related_name="minder_bookings")
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)  # Auto-calculated
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def save(self, *args, **kwargs):
        """Automatically calculate total price before saving."""
        if self.start_date and self.end_date:
            days_booked = (self.end_date - self.start_date).days + 1  # Include last day
            self.total_price = days_booked * self.minder.price_per_day
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking by {self.owner.username} with {self.minder.user.username} from {self.start_date} to {self.end_date}"


class Review(models.Model):
    pet_minder = models.ForeignKey(PetMinder, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Review for {self.pet_minder.user.username} by {self.user.username}"
    class Meta:
        ordering = ['-created_at']
        unique_together = ('pet_minder', 'user') 