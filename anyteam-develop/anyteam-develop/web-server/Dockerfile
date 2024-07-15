FROM nginx:latest

WORKDIR /var/www/html

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs lsof
RUN npm install -g yarn

RUN yarn global add @nestjs/cli forever