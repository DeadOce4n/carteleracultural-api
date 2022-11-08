FROM node:16-alpine
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
RUN yarn
RUN yarn global add pm2
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile
CMD ["pm2-runtime", "./dist/server.js"]
EXPOSE 3000
