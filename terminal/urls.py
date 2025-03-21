from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

from pages import urls as pages_urls


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(pages_urls)),
]


if settings.DEBUG:
    urlpatterns.append(path("404/", TemplateView.as_view(template_name="404.html")))
    urlpatterns.append(path("500/", TemplateView.as_view(template_name="500.html")))
    urlpatterns += static("media/", document_root=settings.MEDIA_ROOT)
