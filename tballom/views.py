from django.shortcuts import render

# Create your views here.

def tballom_name_view(request):
    return render(request, 'html/tballom/tballom_name.html')

def tballom_game_view(request):
    return render(request, 'html/tballom/tballom_game.html')