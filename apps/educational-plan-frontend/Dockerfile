FROM educational-plan:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npx nx run educational-plan-frontend:build --configuration=production

FROM nginx:1.20.2-alpine
COPY --from=builder /app/builder/dist/apps/educational-plan-frontend /usr/share/nginx/html
COPY --from=builder /app/builder/apps/educational-plan-frontend/nginx.conf /etc/nginx/conf.d/app.conf
