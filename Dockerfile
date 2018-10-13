FROM node:alpine
MAINTAINER Yuan Tao <towyuan@outlook.com>

RUN apk update

RUN npm i npm@latest -g
RUN npm i dnm@latest -g

RUN mkdir -p /data
COPY domains.yml /data/dnm/domains.yml

ADD . /opt/ddns

WORKDIR /opt/ddns

RUN npm i --production

ENTRYPOINT npm start
