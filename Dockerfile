# Stage 1: Build the app
FROM node:22.1.0 as builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the lock file and package.json first (to cache deps)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

# Build the app
RUN pnpm build

# Stage 2: Run the app
FROM node:22.1.0

# Install pnpm again
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only production dependencies and build output
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

# Expose the port your Nest app listens on
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
