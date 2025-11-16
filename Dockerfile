# Base image
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies
FROM base AS dependencies
RUN npm ci

# Build stage
FROM dependencies AS builder
COPY . .
# Build a specific app using a build argument
ARG APP_NAME
RUN npm run build ${APP_NAME}

# Final production image
FROM node:20-alpine AS production
# Set the working directory
WORKDIR /usr/src/app
# Copy necessary files from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
# Copy the built app's dist folder
ARG APP_NAME
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist
# Expose port (can be overridden in docker-compose)
EXPOSE 3000
# Command to run the app
CMD ["node", "dist/main.js"]