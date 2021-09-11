FROM node:14-alpine
WORKDIR /app
COPY ["./package.json", "./package-lock.json", "./"]
RUN npm install
COPY [".", "/app"]
RUN npm run build

FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=0 /app/package.json /app/package-lock.json ./
RUN npm install
COPY --from=0 /app/dist ./dist/
EXPOSE 4000
CMD ["node", "/app/dist/main.js"]
