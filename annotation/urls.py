from django.contrib import admin
from django.urls import path, include




from .views import *


urlpatterns = [
    path("", index,name='index'),
    path("upload/", upload, name='upload'),
    path("resultats/", resultats, name="resultats"),
    path("historique/", historique, name="historique"),
    path("admin/", admin.site.urls),
    path("account/", include("account.urls"))

    
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

