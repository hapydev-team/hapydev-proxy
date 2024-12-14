FROM node:20.18.1-alpine3.21 as dependencies
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /app
COPY package.json ./
COPY dist ./dist
RUN yarn global add node-gyp
RUN yarn install --production  


FROM  node:20.18.1-alpine3.21 as production
WORKDIR /app
COPY --from=dependencies /app .
EXPOSE 6003 

CMD ["npm", "run", "server" ]