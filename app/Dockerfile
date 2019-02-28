FROM node:6

WORKDIR /var/nyt/app
COPY app/package.json .
EXPOSE 3000

RUN npm install

CMD [ "npm", "start" ]
