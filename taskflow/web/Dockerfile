FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY taskflow/api/package.json ./taskflow/api/package.json
COPY taskflow/web/package.json ./taskflow/web/package.json
RUN npm ci
COPY taskflow/web ./taskflow/web
RUN npm run build -w @taskflow/web -- --configuration production

FROM nginx:1.27-alpine AS runtime
COPY taskflow/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/taskflow/web/dist/web/browser /usr/share/nginx/html
EXPOSE 80
