#DEV
FROM node:20-alpine

WORKDIR /app

# Copy the package files and install the dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build frontend, using the VITE_BACKEND_URL ARG
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

EXPOSE 5173

CMD ["npm", "run", "dev"]


#Prod two stage template
# BUILD
# # Build stage
# FROM node:20 AS build

# WORKDIR /app

# # Copy package files first
# COPY package*.json ./

# # Install dependencies
# RUN npm ci --legacy-peer-deps

# # Copy all source files
# COPY . .

# # Build frontend, using the VITE_BACKEND_URL ARG
# ARG VITE_BACKEND_URL
# ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy build output to nginx html directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]

