from django.shortcuts import render, redirect
from .models import User

# Create your views here.

def tballom_name_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        password = request.POST.get('password')
        if user_name and password:
            user = User.objects.create(user_name=user_name, password=password)
            return redirect('tballom_game', pk=user.pk)
        else:
            return render(request, 'html/tballom/tballom_name.html', {'error_message': '아이디와 비밀번호를 모두 입력하세요'})
    else:
        return render(request, 'html/tballom/tballom_name.html')

def tballom_game_view(request, pk):
    return render(request, 'html/tballom/tballom_game.html')