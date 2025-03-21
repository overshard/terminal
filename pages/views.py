from django.shortcuts import render
from django.http import HttpResponse


def home(request):
    context = {}
    context['title'] = 'Home'
    context['description'] = 'Made by Isaac Bythewood, simple terminal for people who want to host their own and hack on it a bit.'

    return render(request, 'pages/home.html', context)


def favicon(request):
    icon = "💾"
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">{icon}</text></svg>'
    return HttpResponse(svg, content_type="image/svg+xml")


def robots(request):
    return render(request, 'robots.txt', content_type='text/plain')


def sitemap(request):
    return render(request, 'sitemap.xml', content_type='text/xml')
