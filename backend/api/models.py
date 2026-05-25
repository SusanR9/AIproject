from django.db import models

class Registration(models.Model):
    registration_id = models.AutoField(db_column='Registration_id', primary_key=True)
    first_name = models.CharField(db_column='FirstName', max_length=100)
    last_name = models.CharField(db_column='LastName', max_length=100)
    age = models.IntegerField(db_column='age', null=True, blank=True)
    phno = models.CharField(db_column='Phno', max_length=12)
    address = models.CharField(db_column='Address', max_length=255, null=True, blank=True)
    email = models.CharField(db_column='Email', max_length=100)
    bloodgroup = models.CharField(db_column='Bloodgroup', max_length=50, null=True, blank=True)
    identity_proof = models.FileField(db_column='identity_proof', upload_to='identity_proofs/', max_length=255, null=True, blank=True)
    candidate_photo = models.FileField(db_column='candidate_photo', upload_to='candidate_photos/', max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(db_column='Created_at', auto_now_add=True)
    competition_name = models.CharField(db_column='Competition_name', max_length=100, null=True, blank=True)
    type_of_enroll = models.CharField(db_column='Type_of_Enroll', max_length=100, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'REGISTRATION'


class Payment(models.Model):
    payment_id = models.AutoField(db_column='PaymentId', primary_key=True)
    registration = models.ForeignKey(Registration, models.DO_NOTHING, db_column='Registration_id', null=True, blank=True)
    mode_of_payment = models.CharField(db_column='Mode_of_payment', max_length=100, null=True, blank=True)
    payment_status = models.CharField(db_column='Payment_status', max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(db_column='Created_at', auto_now_add=True)
    transaction_id = models.CharField(db_column='Transaction_Id', max_length=50, null=True, blank=True)
    amount = models.FloatField(db_column='AMOUNT', null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'PAYMENT'
