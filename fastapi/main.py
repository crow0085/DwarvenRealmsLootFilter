from uuid import NIL

import httpx
import requests
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root_health_check():
    return {
        "status": "online",
        "message": "FastAPI is running!",
    }


@app.get("/sc")
async def get_sc_ladder():
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=false&hardcore=false"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    return {
        "status": "online",
        "message": "sc ladder",
        "data": data,
    }


@app.get("/sc/{name}")
async def get_sc_ladder_name(name: str):
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=false&hardcore=false"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    players = data["leaderboards"]

    for player in players:
        if player["name"] == name:
            return {
                "status": "online",
                "message": "sc ladder",
                "data": player,
            }

    return {
        "status": "online",
        "message": "hc ladder",
        "data": "Player Not Found",
    }


@app.get("/scssf")
async def get_scssf_ladder():
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=true&hardcore=false"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    return {
        "status": "online",
        "message": "scssf ladder",
        "data": data,
    }


@app.get("/scssf/{name}")
async def get_scssf_ladder_name(name: str):
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=true&hardcore=false"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    players = data["leaderboards"]

    for player in players:
        if player["name"] == name:
            return {
                "status": "online",
                "message": "scssf ladder",
                "data": player,
            }

    return {
        "status": "online",
        "message": "hc ladder",
        "data": "Player Not Found",
    }


@app.get("/hc")
async def get_hc_ladder():
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=false&hardcore=true"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    return {
        "status": "online",
        "message": "hc ladder",
        "data": data,
    }


@app.get("/hc/{name}")
async def get_hc_ladder_name(name: str):
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=false&hardcore=true"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    players = data["leaderboards"]

    for player in players:
        if player["name"] == name:
            return {
                "status": "online",
                "message": "hc ladder",
                "data": player,
            }

    return {
        "status": "online",
        "message": "hc ladder",
        "data": "Player Not Found",
    }


@app.get("/hcssf")
async def get_hcssf_ladder():
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=true&hardcore=true"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    return {
        "status": "online",
        "message": "hcssf ladder",
        "data": data,
    }


@app.get("/hcssf/{name}")
async def get_hcssf_ladder_name(name: str):
    url = "http://loadbalancer-prod-1ac6c83-453346156.us-east-1.elb.amazonaws.com/leaderboards/scores/?fellowship=true&hardcore=true"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    data = response.json()
    players = data["leaderboards"]

    for player in players:
        if player["name"] == name:
            return {
                "status": "online",
                "message": "hcssf ladder",
                "data": player,
            }

    return {
        "status": "online",
        "message": "hc ladder",
        "data": "Player Not Found",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
