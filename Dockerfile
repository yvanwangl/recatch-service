FROM node:8.9.1

MAINTAINER yvanwang googolewang@gmail.com

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package*.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /usr/src

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src
#RUN git clone -b master https://github.com/yvanwangl/recatch-service.git
COPY . .

WORKDIR /usr/src/recatch-service
RUN cp -a /tmp/node_modules /usr/src/recatch-service

#npm install dependencies
RUN npm install -g pm2 pm2-docker typescript@2.6.1

#RUN npm install
#CMD npm run build

EXPOSE 8082

#RUN npm run start:prod
CMD ["pm2-docker", "./build/bin/www.js"]