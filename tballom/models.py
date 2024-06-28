from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.
class User(models.Model):
    user_name = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name

class Point(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_point = models.IntegerField(default=0)

    def __str__(self):
        return str(self.user_point)

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_score = models.IntegerField(default=0)

    def __str__(self):
        return str(self.user_score)

class Bat(models.Model):
    bat_name = models.CharField(max_length=20)
    bat_price = models.IntegerField()

    def __str__(self):
        return f'{self.bat_name} : {self.bat_price}'

class UserBat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bat = models.ForeignKey(Bat, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.user_name}:{self.bat.bat_name}'

@receiver(post_save, sender=User)
def create_default_bat(sender, instance, created, **kwargs):
    if created:
        default_bat, bat_created = Bat.objects.get_or_create(bat_name='파리채', defaults={'bat_price': 0})
        UserBat.objects.create(user=instance, bat=default_bat)