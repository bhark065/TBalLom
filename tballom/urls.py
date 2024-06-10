from django.urls import path
from tballom import views

app_name = "tballom"

urlpatterns = [
    path('', views.tballom_name_view, name='tballom_name_view'),
    path('game/<int:pk>/', views.tballom_game_view, name='tballom_game'),
    path('store/', views.tballom_store_view, name='tballom_store_view'),
    path('rank/', views.tballom_rank_view, name='tballom_rank_view'),
]