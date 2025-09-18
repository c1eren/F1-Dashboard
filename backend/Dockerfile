#DEV
FROM node:20

WORKDIR /app

ENV NODE_ENV=development

# Copy package files first
COPY package*.json ./

# Install all dependencies, including dev for ts-node-dev
RUN npm install --legacy-peer-deps --include=dev

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
