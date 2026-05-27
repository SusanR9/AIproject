import razorpay

from django.conf import settings

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Registration, Payment


# =====================================
# Razorpay Client
# =====================================

try:
    client = razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        )
    )
except Exception:
    client = None


# =====================================
# REGISTER PARTICIPANT
# =====================================

@api_view(['POST'])
def verify_payment(request):

    try:
        data = request.data

        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        registration_id = data.get('registration_id')
        amount = data.get('amount', 0)

        # 1. VERIFY SIGNATURE
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # 2. GET REGISTRATION
        registration = Registration.objects.filter(
            registration_id=registration_id
        ).first()

        if not registration:
            return Response(
                {'error': 'Registration not found'},
                status=404
            )

        # 3. CREATE / UPDATE PAYMENT
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
            'message': 'Payment verified and saved successfully',
            'payment_status': payment.payment_status,
            'transaction_id': payment.transaction_id
        })

    except razorpay.errors.SignatureVerificationError:
        return Response(
            {'error': 'Invalid payment signature'},
            status=400
        )

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )
# =====================================
# GET REGISTRATIONS
# =====================================

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

        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =====================================
# CREATE ORDER
# =====================================

@api_view(['POST'])
def create_order(request):

    try:

        if client is None:
            return Response(
                {
                    'error': 'Razorpay not configured'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        data = request.data

        amount = data.get('amount')
        registration_id = data.get('registration_id')

        if not amount:

            return Response(
                {
                    'error': 'Amount is required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        amount_in_paise = int(float(amount) * 100)

        order = client.order.create(
            data={
                'amount': amount_in_paise,
                'currency': 'INR',
                'receipt': f'receipt_{registration_id}',
                'payment_capture': 1
            }
        )

        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key_id': settings.RAZORPAY_KEY_ID
        })

    except Exception as e:

        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =====================================
# VERIFY PAYMENT
# =====================================

@api_view(['POST'])
def verify_payment(request):

    try:

        if client is None:
            return Response(
                {
                    'error': 'Razorpay not configured'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        data = request.data

        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')

        registration_id = data.get('registration_id')

        amount = data.get('amount', 0)

        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        registration = Registration.objects.filter(
            registration_id=registration_id
        ).first()

        Payment.objects.create(
            registration=registration,
            mode_of_payment='Razorpay',
            payment_status='SUCCESS',
            transaction_id=razorpay_payment_id,
            amount=amount
        )

        return Response(
            {
                'message': 'Payment verified successfully'
            }
        )

    except razorpay.errors.SignatureVerificationError:

        return Response(
            {
                'error': 'Invalid payment signature'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:

        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =====================================
# GET COMPETITIONS
# =====================================

@api_view(['GET'])
def get_competitions(request):

    try:

        data = [
            {
                "id": 1,
                "title": "Cooking Competition"
            },
            {
                "id": 2,
                "title": "Dance Competition"
            },
            {
                "id": 3,
                "title": "Singing Competition"
            }
        ]

        return Response(data)

    except Exception as e:

        return Response(
            {
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )