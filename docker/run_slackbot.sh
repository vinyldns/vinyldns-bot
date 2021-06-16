#!/usr/bin/env bash

docker pull [docker-image-location]:latest
docker-compose down
docker-compose up -d
docker image prune -f
