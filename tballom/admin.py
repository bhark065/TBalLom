from django.contrib import admin
from tballom.models import User, Point, Score, Bat, UserBat

# Register your models here.
admin.site.register(User)
admin.site.register(Point)
admin.site.register(Score)
admin.site.register(Bat)
admin.site.register(UserBat)