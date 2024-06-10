from django.shortcuts import render, redirect, get_object_or_404
from .models import User, Point


# Create your views here.

def tballom_name_view(request):
    user_name = request.POST.get('user_name')
    if not user_name:
        return render(request, 'html/tballom/tballom_name.html')

    # user_name이 이미 존재하는지 확인
    user = User.objects.filter(user_name=user_name).first()

    if user:
        # 이미 존재하는 사용자 이름일 경우
        return redirect('tballom:tballom_game', pk=user.pk)
    else:
        # 새로운 사용자 이름일 경우
        new_user = User.objects.create(user_name=user_name)
        return redirect('tballom:tballom_game', pk=new_user.pk)

def tballom_game_view(request, pk):
    user = get_object_or_404(User, pk=pk)
    user_id = request.user.id
    user_point = Point.objects.filter(user_id=user_id).first()
    return render(request, 'html/tballom/tballom_game.html', {'user': user, 'user_point': user_point})

def tballom_store_view(request):
    return render(request, 'html/tballom/tballom_store.html')

def tballom_rank_view(request):
    return render(request, 'html/tballom/tballom_rank.html')