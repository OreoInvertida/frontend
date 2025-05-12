FROM node:24.0.1-slim
COPY . /app
WORKDIR /app

RUN npm install
EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
