FROM node:14.17.3-alpine

# アプリケーションの構築
WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli typescript nodemon redoc-cli typeorm-uml
RUN apk add fontconfig \
    && fc-cache -rv \
    && mkdir -m 777 -p /usr/share/fonts /usr/share/fonts/Noto_Serif_JP \
    && wget https://fonts.google.com/download?family=Noto%20Serif%20JP -O /usr/share/fonts/tmp \
    && chmod -R 777 /usr/share/fonts/tmp \
    && unzip /usr/share/fonts/tmp -d /usr/share/fonts/Noto_Serif_JP \
    && rm -rf /usr/share/fonts/tmp \
    && fc-cache -rv \