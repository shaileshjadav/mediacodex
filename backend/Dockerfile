# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install 
RUN npm -g install typescript dbmate

# Copy source code
COPY . .

# Build TypeScript to JavaScript (BEFORE removing devDependencies)
RUN npm run build

# Remove devDependencies to reduce image size (AFTER build)
RUN npm prune --production && npm cache clean --force

# Expose port 3000
EXPOSE 3000

