import razorpay
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Registration, Payment
from .serializers import RegistrationSerializer

# Initialize Razorpay Client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
def register_participant(request):
    data = request.data
    files = request.FILES

    # Extract name and split into first and last
    full_name = data.get('name', '')
    name_parts = full_name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    # Get competition type (paid or free) based on frontend payload or ID
    # For now, we will store the raw ID if we don't have the name.
    comp_id = data.get('competition_id', '')

    registration = Registration(
        first_name=first_name,
        last_name=last_name,
        age=data.get('age'),
        phno=data.get('phone', ''),
        address=data.get('city', ''),
        email=data.get('email', ''),
        bloodgroup=data.get('bloodgroup', ''),
        competition_name=comp_id, # Can be enhanced to map to actual name
        identity_proof=files.get('identity_proof_file'),
        candidate_photo=files.get('candidate_photo_file'),
    )
    registration.save()

    serializer = RegistrationSerializer(registration)
    return Response({
        'message': 'Registration successful',
        'registration_id': registration.registration_id,
        'data': serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_registrations(request):
    try:
        registrations = Registration.objects.all().order_by('-created_at')
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_order(request):
    # Expecting amount in INR (rupees). Razorpay takes paise (amount * 100)
    data = request.data
    amount = data.get('amount')
    registration_id = data.get('registration_id')

    if not amount:
        return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Convert to paise
    amount_in_paise = int(float(amount) * 100)

    try:
        # Create Razorpay Order
        order_data = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'receipt_{registration_id}',
            'payment_capture': 1
        }
        order = client.order.create(data=order_data)

        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key_id': settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_payment(request):
    data = request.data
    
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    registration_id = data.get('registration_id')
    amount = data.get('amount', 0) # Optionally sent from frontend

    try:
        # Verify the signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # Save payment record in DB
        registration = Registration.objects.filter(registration_id=registration_id).first()
        payment = Payment(
            registration=registration,
            mode_of_payment='Razorpay',
            payment_status='SUCCESS',
            transaction_id=razorpay_payment_id,
            amount=amount
        )
        payment.save()

        return Response({'message': 'Payment verified successfully'}, status=status.HTTP_200_OK)
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_competitions(request):
    """
    Return a list of distinct competition names.
    Each entry has an artificial incremental id and the title.
    """
    distinct_names = (
        Registration.objects
        .values_list('competition_name', flat=True)
        .exclude(competition_name__isnull=True)
        .exclude(competition_name__exact='')
        .distinct()
    )
    data = [{"id": idx + 1, "title": name} for idx, name in enumerate(distinct_names)]
    return Response(data, status=status.HTTP_200_OK)
