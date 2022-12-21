FROM node:alpine

WORKDIR /app

# COPY package.json .

# RUN npm install
COPY package.json ./
RUN npm i --silent
COPY . ./
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
