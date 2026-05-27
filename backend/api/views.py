import razorpay
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Registration, Payment


# =========================
# RAZORPAY CLIENT (FIXED)
# =========================

client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


# =========================
# REGISTER PARTICIPANT
# =========================

@api_view(['POST'])
def register_participant(request):
    try:
        data = request.data
        files = request.FILES

        full_name = data.get('name', '').strip()
        name_parts = full_name.split(' ', 1)

        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        registration = Registration.objects.create(
            first_name=first_name,
            last_name=last_name,
            age=data.get('age'),
            phno=data.get('phone', ''),
            address=data.get('city', ''),
            email=data.get('email', ''),
            bloodgroup=data.get('bloodgroup', ''),
            competition_name=data.get('competition_id', ''),
            identity_proof=files.get('identity_proof_file'),
            candidate_photo=files.get('candidate_photo_file'),
        )

        return Response({
            'message': 'Registration successful',
            'registration_id': registration.registration_id
        }, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# =========================
# GET REGISTRATIONS
# =========================

@api_view(['GET'])
def get_registrations(request):
    try:
        registrations = Registration.objects.all()[:50]

        data = []
        for reg in registrations:
            data.append({
                'registration_id': reg.registration_id,
                'first_name': reg.first_name,
                'last_name': reg.last_name,
                'email': reg.email,
                'competition_name': reg.competition_name,
            })

        return Response(data)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# =========================
# GET COMPETITIONS
# =========================

@api_view(['GET'])
def get_competitions(request):
    return Response([
        {"id": 1, "title": "Cooking Competition"},
        {"id": 2, "title": "Dance Competition"},
        {"id": 3, "title": "Singing Competition"},
    ])


# =========================
# CREATE RAZORPAY ORDER
# =========================

@api_view(['POST'])
def create_order(request):
    try:
        data = request.data
        amount = data.get('amount')
        registration_id = data.get('registration_id')

        if not amount:
            return Response({'error': 'Amount required'}, status=400)

        amount_in_paise = int(float(amount) * 100)

        order = client.order.create(data={
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'receipt_{registration_id}',
            'payment_capture': 1
        })

        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key_id': settings.RAZORPAY_KEY_ID
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# =========================
# VERIFY PAYMENT (FINAL FIXED)
# =========================

@api_view(['POST'])
def verify_payment(request):
    try:
        data = request.data

        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        registration_id = data.get('registration_id')
        amount = data.get('amount', 0)

        # VERIFY SIGNATURE
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        registration = Registration.objects.filter(
            registration_id=registration_id
        ).first()

        if not registration:
            return Response({'error': 'Registration not found'}, status=404)

        # CREATE OR UPDATE PAYMENT
        payment, created = Payment.objects.get_or_create(
            registration=registration,
            defaults={
                'mode_of_payment': 'Razorpay',
                'payment_status': 'SUCCESS',
                'transaction_id': razorpay_payment_id,
                'amount': amount
            }
        )

        if not created:
            payment.payment_status = "SUCCESS"
            payment.transaction_id = razorpay_payment_id
            payment.amount = amount
            payment.save()

        return Response({
            'message': 'Payment verified successfully',
            'status': payment.payment_status
        })

    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Invalid signature'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
        from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})