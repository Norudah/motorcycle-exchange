FROM node:17-slim

# RUN npm install -g nodemon

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

# COPY package.json .

# RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run", "dev"]
