FROM node:16.4.1

WORKDIR /code

EXPOSE 9998

ENV HOST 0.0.0.0

COPY package.json /code/package.json

RUN npm install

COPY . /code

CMD [ "node", "index.js"]