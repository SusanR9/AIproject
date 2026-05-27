from django.db import models


class Registration(models.Model):
    registration_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField(null=True, blank=True)
    phno = models.CharField(max_length=12)
    address = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=100)
    bloodgroup = models.CharField(max_length=50, null=True, blank=True)
    identity_proof = models.FileField(upload_to='identity_proofs/', null=True, blank=True)
    candidate_photo = models.FileField(upload_to='candidate_photos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    competition_name = models.CharField(max_length=100, null=True, blank=True)
    type_of_enroll = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'REGISTRATION'


class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)

    registration = models.ForeignKey(
        Registration,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    mode_of_payment = models.CharField(max_length=50, default="Razorpay")
    payment_status = models.CharField(max_length=20, default="PENDING")
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'PAYMENT'