from django.urls import path
from .views import (
    register_participant,
    get_registrations,
    get_competitions,
    create_order,
    verify_payment,
)

urlpatterns = [
    path('register/', register_participant, name='register'),
    path('registrations/', get_registrations, name='get_registrations'),

    # IMPORTANT
    path('competitions/', get_competitions, name='get_competitions'),

    path('payment/create-order/', create_order, name='create-order'),
    path('payment/verify/', verify_payment, name='verify-payment'),
]