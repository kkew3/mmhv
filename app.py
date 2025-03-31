import os

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import requests
from pydantic import BaseModel

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount('/static', StaticFiles(directory='static'), name='static')

BASEURL = os.environ['MINIFLUX_BASEURL']
API_KEY = os.environ['MINIFLUX_API_KEY']
HOST = os.getenv('MMHV_HOST', '127.0.0.1')
PORT = int(os.getenv('MMHV_PORT', '8051'))


class SyncEntriesStateQuery(BaseModel):
    entries_read: list[int]
    entries_star: list[int]


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


@app.post('/{feed_id}')
def sync_entries_state(feed_id: int, query_body: SyncEntriesStateQuery):
    try:
        for entry_id in query_body.entries_star:
            requests.put(
                f'{BASEURL}/v1/entries/{entry_id}/bookmark',
                headers={
                    'X-Auth-Token': API_KEY,
                }).raise_for_status()
        requests.put(
            f'{BASEURL}/v1/entries',
            headers={
                'Content-Type': 'application/json',
                'X-Auth-Token': API_KEY,
            },
            json={
                'entry_ids': query_body.entries_read,
                'status': 'read',
            }).raise_for_status()
    except requests.RequestException as err:
        return {'message': 'error', 'error': str(err)}
    return {'message': 'success'}


def cli():
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
