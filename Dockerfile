# Stage 1: Build
FROM node:20-alpine AS builder 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app /app
USER nodejs
EXPOSE 8080
CMD ["node", "app.js"] 
