import os

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import requests

app = FastAPI()
templates = Jinja2Templates(directory="templates")

BASEURL = os.environ['MINIFLUX_BASEURL']
API_KEY = os.environ['MINIFLUX_API_KEY']


@app.get('/{feed_id}', response_class=HTMLResponse)
def get_entries(request: Request, feed_id: int):
    entries = requests.get(
        f'{BASEURL}/v1/feeds/{feed_id}/entries',
        params={
            'status': 'unread',
            'order': 'published_at',
            'direction': 'asc',
        },
        headers={
            'X-Auth-Token': API_KEY,
        }).json()['entries']
    return templates.TemplateResponse(
        request=request, name='index.html', context={'entries': entries})
