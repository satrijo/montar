#parent image
FROM node:lts
WORKDIR /app
COPY . /app
RUN npm install -g yarn
RUN yarn install
CMD ["yarn", "start"]