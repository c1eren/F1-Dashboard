# Use Node for building
FROM node:20 AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clean reproducible install
RUN npm install --legacy-peer-deps

# Explicitly install rollup wasm build (portable)
RUN npm install @rollup/wasm-node --save-dev

# Copy everything else
COPY . .

# Build frontend
RUN npm run build

# Use nginx to serve built frontend
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]