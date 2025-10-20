FROM FROM node:22.19.0-trixie-slim

COPY package*.json /home/node/app/

WORKDIR /home/node/app

# Install packages
RUN npm ci
RUN apk update \
    && apk add bind-tools libcap --no-cache \
    && setcap cap_net_raw+ep /usr/bin/dig

VOLUME /home/node/app/logs

# Copy everything
COPY . .

ENV HUBOT_SLACK_TOKEN="<define_me>"
ENV HUBOT_HTTPD=false
CMD ["/bin/sh", "./bin/hubot", "--adapter", "slack" ]
