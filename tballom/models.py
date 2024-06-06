from django.db import models

# Create your models here.
class User(models.Model):
    user_name = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Point(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_point = models.IntegerField()

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_score = models.IntegerField()

class Bat(models.Model):
    bat_name = models.CharField(max_length=20)
    bat_price = models.IntegerField()

class UserBat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bat = models.ForeignKey(Bat, on_delete=models.CASCADE)