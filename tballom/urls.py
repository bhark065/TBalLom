from django.urls import path
from tballom import views

app_name = "tballom"

urlpatterns = [
    path('home/', views.tballom_name_view, name='Home'),
]