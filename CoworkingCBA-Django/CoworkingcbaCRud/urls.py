# CoworkingcbaCRud/urls.py
from django.contrib import admin
from django.urls import path
from django.urls import re_path

from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ApiCoworking.urls')),
    
    
]
