from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Point, Score, UserBat
from django.http import JsonResponse


def tballom_name_view(request):
    user_name = request.POST.get('user_name')
    if not user_name:
        return render(request, 'html/tballom/tballom_name.html')

    user = User.objects.filter(user_name=user_name).first()
    if user:
        return redirect('tballom:tballom_game_view')
    else:
        new_user = User.objects.create(user_name=user_name)
        request.user = new_user
        return redirect('tballom:tballom_game_view')

def tballom_game_view(request):
    user = get_object_or_404(User, id=request.user.id)
    user_point = Point.objects.filter(user=user).first()
    user_bat = UserBat.objects.filter(user=user)
    return render(request, 'html/tballom/tballom_game.html', {'user': user, 'user_point': user_point, 'user_bat': user_bat})

@csrf_exempt
def save_score(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            user_score = data.get('user_score')

            user = User.objects.get(id=user_id)
            score, created = Score.objects.get_or_create(user=user)
            if not created:
                if score.user_score < user_score:
                    score.user_score = user_score
                    score.save()
            else:
                score.user_score = user_score
                score.save()

            return JsonResponse({'status': '저장 완료'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'status': '사용자를 찾을 수 없습니다'}, status=404)
        except ValueError:
            return JsonResponse({'status': '잘못된 데이터 형식'}, status=400)
        except Exception as e:
            return JsonResponse({'status': '서버 오류', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': '잘못된 요청'}, status=400)

@csrf_exempt
def save_point(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            user_score = data.get('user_score')

            user = User.objects.get(id=user_id)
            point, created = Point.objects.get_or_create(user=user, defaults={'user_point': 0})
            point.user_point += user_score
            point.save()

            return JsonResponse({'status': '저장 완료'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'status': '사용자를 찾을 수 없습니다'}, status=404)
        except ValueError:
            return JsonResponse({'status': '잘못된 데이터 형식'}, status=400)
        except Exception as e:
            return JsonResponse({'status': '서버 오류', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': '잘못된 요청'}, status=400)

def tballom_store_view(request):
    return render(request, 'html/tballom/tballom_store.html')

def tballom_rank_view(request):
    users = User.objects.all()
    scores = Score.objects.all()

    user_scores = [
        {"name": user.user_name, "score": score.user_score}
        for user, score in zip(users, scores)
    ]

    sorted_user_scores = sorted(user_scores, key=lambda x: x['score'], reverse=True)

    for idx, user_score in enumerate(sorted_user_scores, start=1):
        user_score['rank'] = idx

    user = get_object_or_404(User, id=request.user.id)
    user_point = Point.objects.filter(user=user).first()

    return render(request, 'html/tballom/tballom_rank.html',{'user_scores': sorted_user_scores, 'user_point': user_point})