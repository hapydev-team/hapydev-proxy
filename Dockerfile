FROM node:20.9.0-alpine3.18 as dependencies
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /app
COPY package*.json ./
RUN yarn global add node-gyp
RUN yarn install --production  


FROM node:20.9.0-alpine3.18 as production
WORKDIR /app
COPY package.json  ./
COPY dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules  
EXPOSE 30001 

CMD ["npm", "run", "test" ]