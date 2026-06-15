# Stage 1: Build the Angular app
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy sources and compile production build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy compiled outputs from build stage
COPY --from=build /app/dist/ccms-frontend/browser /usr/share/nginx/html
# Copy custom Nginx routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]