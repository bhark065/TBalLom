from django.shortcuts import render

# Create your views here.

def tballom_name_view(request):
    return render(request, 'html/tballom_name.html')