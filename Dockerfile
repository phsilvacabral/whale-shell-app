FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# Build-time config for Vite
ARG VITE_BFF_URL
ENV VITE_BFF_URL=$VITE_BFF_URL

RUN npm run build

# Serve static with Nginx
FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]