FROM node:16-alpine
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
RUN yarn
RUN yarn global add pm2
RUN yarn build
CMD ["pm2-runtime", "./dist/server.js"]
EXPOSE 3000
