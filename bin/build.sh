#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Move to the context root
cd ${DIR}/..

# Build and deploy
echo "Building docker image"
docker build -t hub.comcast.net/cap/vinyldns/vinyldns-bot:${BOT_CONTAINER_TAG:-latest} . -f ./docker/Dockerfile