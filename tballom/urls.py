from django.urls import path
from tballom import views

app_name = "tballom"

urlpatterns = [
    path('', views.tballom_name_view, name='tballom_name_view'),
    # path('', views.tballom_name_view, name='Main'),
    # path('game/', views.tballom_game_view, name='Game'),
    path('game/<int:pk>/', views.tballom_game_view, name='tballom_game'),
]