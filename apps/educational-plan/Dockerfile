FROM educational-plan:nx-base AS builder

WORKDIR /app/builder
COPY . .
RUN npx nx run educational-plan:build --configuration=production

FROM educational-plan:nx-base

WORKDIR /app
COPY --from=builder /app/builder ./
ENV NODE_ENV=production

CMD ["node", "./dist/apps/educational-plan/main.js"]
