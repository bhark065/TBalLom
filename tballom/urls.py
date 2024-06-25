from django.urls import path
from tballom import views

app_name = "tballom"

urlpatterns = [
    path('', views.tballom_name_view, name='tballom_name_view'),
    path('game/', views.tballom_game_view, name='tballom_game_view'),
    path('store/', views.tballom_store_view, name='tballom_store_view'),
    path('rank/', views.tballom_rank_view, name='tballom_rank_view'),
    path('save-score/', views.save_score, name='save_score'),
    path('save-point/', views.save_point, name='save_point'),
]