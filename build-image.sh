#!/bin/bash
tag=$(git describe --tags --abbrev)
image="registry.0x42.in/library/docker/genesis-avalon-ui"

docker buildx build --push --platform linux/amd64 -t ${image}:${tag}-amd64 .
docker buildx build --push --platform linux/arm64 -t ${image}:${tag}-arm64 .
docker buildx imagetools create -t ${image}:${tag} \
    ${image}:${tag}-amd64 \
    ${image}:${tag}-arm64
