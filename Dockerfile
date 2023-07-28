FROM node AS build

RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -O /tmp/jq-linux64 && cp /tmp/jq-linux64 /usr/bin/jq && chmod +x /usr/bin/jq
WORKDIR /app
COPY . .
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./config/config.json > ./config/config.tmp.json && mv ./config/config.tmp.json ./config/config.json
RUN npm i && npm run build

FROM nginx:alpine
LABEL maintainer="Jakub Korsak jakub@korsak.xyz"

ENV API_URL="http://localhost:8080"
ENV FRONT_URL="http://localhost"
COPY config/start-nginx.sh /usr/bin/start-nginx.sh
RUN rm -rf /etc/nginx/conf.d && chmod +x /usr/bin/start-nginx.sh
COPY config/conf /etc/nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

EXPOSE 80

ENTRYPOINT [ "start-nginx.sh" ]
