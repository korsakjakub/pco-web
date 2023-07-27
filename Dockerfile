FROM node AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
LABEL maintainer="Jakub Korsak jakub@korsak.xyz"

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
