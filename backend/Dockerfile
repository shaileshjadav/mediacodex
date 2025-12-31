# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci 

# Copy source code
COPY . .

# Build TypeScript to JavaScript (BEFORE removing devDependencies)
RUN npm run build

# Remove devDependencies to reduce image size (AFTER build)
RUN npm prune --production && npm cache clean --force

# Expose port 3000
EXPOSE 3000

# Run migrations and start the application
CMD sh -c "npm run migrate:up && npm start"