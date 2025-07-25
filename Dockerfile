# Builder stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN npm install --production
EXPOSE 1337
CMD ["npm", "run", "start"]                                                                                                                                   This is the Dockerfile i use is it ok and you can make changes but let it be much lighter image of starpi-app
