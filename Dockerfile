FROM node:8.9.1

MAINTAINER yvanwang googolewang@gmail.com

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package*.json /tmp/
RUN cd /tmp && npm install && mkdir -p /usr/src

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src
RUN git clone -b master https://github.com/yvanwangl/recatch-service.git

WORKDIR /usr/src/recatch-service
RUN cp -a /tmp/node_modules /usr/src/recatch-service && npm run build

EXPOSE 8082

#RUN container run command
CMD ["npm", "run", "start:prod"]