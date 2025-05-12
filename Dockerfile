FROM node:24.0.1-slim
COPY . /app
WORKDIR /app

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
