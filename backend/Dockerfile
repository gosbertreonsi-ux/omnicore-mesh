# Use a lightweight, high-performance Node base image matching your runtime version
FROM node:24-alpine

# Set the active working context inside the isolation container
WORKDIR /app

# Copy dependency configuration vectors first to leverage layer caching
COPY package*.json ./

# Install clean production dependencies directly inside the node
RUN npm ci --only=production

# Copy the backend source files and shared data layers into the container ecosystem
COPY src/ ./src/
COPY ../shared/ ../shared/

# Expose the internal event routing gateway port
EXPOSE 5001

# Enforce environmental defaults
ENV NODE_ENV=production
ENV PORT=5001

# Run the type-safe engine natively using Node v24 flags
CMD ["node", "--experimental-strip-types", "src/gateway.ts"]
