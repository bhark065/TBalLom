from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Point, Score
from django.http import JsonResponse


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

# score 저장
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
                # 기존 점수가 있을 경우 비교하여 더 높은 점수로 업데이트
                if score.user_score < user_score:
                    score.user_score = user_score
                    score.save()
            else:
                # 기존 점수가 없을 경우 새로 저장
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
    return render(request, 'html/tballom/tballom_rank.html')