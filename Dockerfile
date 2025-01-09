FROM node:20.18.1-alpine3.21 as dependencies
WORKDIR /app
COPY  . .
RUN npm install pnpm -g
RUN pnpm install
RUN npm run build


FROM  node:20.18.1-alpine3.21 as production
WORKDIR /app
COPY --from=dependencies /app .
EXPOSE 6003 

CMD ["npm", "run", "server" ]