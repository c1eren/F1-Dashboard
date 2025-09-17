FROM node:20

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies, including dev
RUN npm install --legacy-peer-deps --include=dev

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN rm -rf node_modules/.prisma && npx prisma generate

EXPOSE 3001

# Run backend via npm (ts-node guaranteed in path)
CMD ["npm", "run", "dev"]

# # ---- Build stage ----
# FROM node:20 AS builder

# WORKDIR /app
# ENV NODE_ENV=development

# # Copy package files and install all deps
# COPY package*.json ./
# RUN npm install --legacy-peer-deps -include=dev

# # Copy source code
# COPY . .

# # Generate Prisma client
# RUN rm -rf node_modules/.prisma && npx prisma generate

# # ---- Run stage ----
# FROM node:20

# WORKDIR /app
# ENV NODE_ENV=development

# # Copy app + node_modules from builder
# COPY --from=builder /app ./

# # Expose backend port
# EXPOSE 3001

# # Run the backend with ts-node
# CMD ["npm", "run", "dev"]

# # ---- Build stage ----
# FROM node:20 AS builder

# # Set working directory
# WORKDIR /app

# # Ensure dev dependencies are installed
# ENV NODE_ENV=development

# # Copy package files first
# COPY package*.json ./

# # Install dependencies (Linux binaries will be built here)
# RUN npm install --legacy-peer-deps

# # Copy source code
# COPY . .

# # Generate Prisma client for both native (dev) and Linux
# #RUN npx prisma generate --binary-targets native,debian-openssl-3.0.x prisma no longer uses binary targets
# RUN rm -rf node_modules/.prisma && npx prisma generate

# # ---- Run stage ----
# FROM node:20

# WORKDIR /app

# # Copy everything from builder stage
# COPY --from=builder /app ./

# # Expose backend port
# EXPOSE 3001

# # Run the backend
# CMD ["npm", "run", "dev"]