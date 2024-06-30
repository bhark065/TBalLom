from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Point, Score, UserBat, Bat
from django.http import JsonResponse


def tballom_name_view(request):
    user_name = request.POST.get('user_name')
    if not user_name:
        return render(request, 'html/tballom/tballom_name.html')

    user = User.objects.filter(user_name=user_name).first()
    if user:
        request.session['user_id'] = user.id
        return redirect('tballom:tballom_game_view')
    else:
        new_user = User.objects.create(user_name=user_name)
        request.session['user_id'] = new_user.id
        return redirect('tballom:tballom_game_view')

def tballom_game_view(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('tballom:tballom_name_view')

    user = get_object_or_404(User, id=user_id)
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
            score.user_score = user_score
            score.save()

            return JsonResponse({'status': '저장 완료', 'user_score': score.user_score}, status=200)
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

            return JsonResponse({'status': '저장 완료', 'user_point': point.user_point}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'status': '사용자를 찾을 수 없습니다'}, status=404)
        except ValueError:
            return JsonResponse({'status': '잘못된 데이터 형식'}, status=400)
        except Exception as e:
            return JsonResponse({'status': '서버 오류', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': '잘못된 요청'}, status=400)

@csrf_exempt
def buying_bat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            bat_point = data.get('bat_point')

            user = User.objects.get(id=user_id)
            point, created = Point.objects.get_or_create(user=user, defaults={'user_point': 0})

            # 구매한 배트 정보 저장
            bat_name = data.get('bat_name')
            bat = Bat.objects.get(bat_name=bat_name)
            if UserBat.objects.filter(user=user, bat=bat).exists():
                return JsonResponse({'status': '이미 구매한 배트입니다.'}, status=400)
            else:
                user_bat = UserBat.objects.create(user=user, bat=bat)
                point.user_point -= bat_point
                point.save()

            return JsonResponse({'status': '배트 구매가 완료되었습니다.', 'user_point': point.user_point}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'status': '사용자를 찾을 수 없습니다'}, status=404)
        except ValueError:
            return JsonResponse({'status': '잘못된 데이터 형식'}, status=400)
        except Exception as e:
            return JsonResponse({'status': '서버 오류', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': '잘못된 요청'}, status=400)

def tballom_store_view(request):
    user_id = request.session.get('user_id')
    user = get_object_or_404(User, id=user_id)
    user_point = Point.objects.filter(user=user).first()

    return render(request, 'html/tballom/tballom_store.html', {'user_point': user_point})

def tballom_rank_view(request):
    users = User.objects.all()
    scores = Score.objects.all()

    # 리스트 컴프리헨션 : 리스트를 쉽게, 짧게 한 줄로 만들 수 있는 파이썬 문법
    # 리스트를 쉽게 만들면서 동시에 리스트를 반환함.
    # user_scores = [
    #     {"name": user.user_name, "score": score.user_score}
    #     for user, score in zip(users, scores)
    # ]
    user_scores = []
    for user, score in zip(users, scores):
        user_scores.append({"userId": user.id, "name": user.user_name, "score": score.user_score})

    sorted_user_scores = sorted(user_scores, key=lambda x: x['score'], reverse=True)

    for idx, user_score in enumerate(sorted_user_scores, start=1):
        user_score['rank'] = idx

    user_id = request.session.get('user_id')
    user = get_object_or_404(User, id=user_id)
    user_point = Point.objects.filter(user=user).first()

    return render(request, 'html/tballom/tballom_rank.html',{'user_scores': sorted_user_scores, 'user_point': user_point})