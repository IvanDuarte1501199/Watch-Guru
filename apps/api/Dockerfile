# Build from the repository root:
#   docker build -f apps/api/Dockerfile -t watchguru-api .
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN npm ci -w api --include-workspace-root=false
COPY apps/api apps/api
RUN npm run build -w api

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN npm ci -w api --omit=dev --include-workspace-root=false
COPY --from=build /repo/apps/api/dist apps/api/dist
COPY apps/api/drizzle apps/api/drizzle
WORKDIR /repo/apps/api
EXPOSE 4000
# Apply pending migrations on every deploy, then start the server.
CMD ["sh", "-c", "node dist/migrate.js && node dist/server.js"]
