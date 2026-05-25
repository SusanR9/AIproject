from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_participant, name='register'),
    path('registrations/', views.get_registrations, name='get_registrations'),
    path('payment/create-order/', views.create_order, name='create-order'),
    path('payment/verify/', views.verify_payment, name='verify-payment'),
    path('registrations/competitions/', views.get_competitions, name='get_competitions'),
]
