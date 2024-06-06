from django.db import models

# Create your models here.
class User(models.Model):
    user_name = models.CharField(max_length=10, null=False)
    password = models.CharField(max_length=10, null=False)
    createAt = models.DateTimeField(auto_now_add=True)
    updateAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user_name} : {self.password}'

class Point(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_point = models.IntegerField()

    def __str__(self):
        return f'{self.user.user_name} : {self.user_point}'

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_score = models.IntegerField()

    def __str__(self):
        return f'{self.user.user_name} : {self.user_score}'

class Bat(models.Model):
    bat_name = models.CharField(max_length=20)
    bat_price = models.IntegerField()

    def __str__(self):
        return self.bat_name