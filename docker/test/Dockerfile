FROM node:10-alpine

COPY package*.json /home/node/app/

WORKDIR /home/node/app

# Install packages
RUN npm ci
RUN apk update \
    && apk add bind-tools libcap --no-cache \
    && setcap cap_net_raw+ep /usr/bin/dig

# Copy everything
COPY . .

CMD ["npm", "test"]