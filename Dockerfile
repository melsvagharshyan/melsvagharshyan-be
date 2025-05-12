# Stage 1: Build the app
FROM node:22.1.0 as builder

RUN npm install -g pnpm@8.15.4

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Stage 2: Run the app
FROM node:22.1.0

RUN npm install -g pnpm@8.15.4

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
