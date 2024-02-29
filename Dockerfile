FROM node:20.11-bookworm as builder

WORKDIR /build
COPY . .
RUN yarn && yarn build

FROM caddy:2.6-alpine

COPY --from=builder /build/dist/ /usr/share/caddy