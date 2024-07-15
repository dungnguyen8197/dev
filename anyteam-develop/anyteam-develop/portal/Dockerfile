FROM node:14.17.3-alpine

ENV CMS_ROOT /usr/src/app
WORKDIR $CMS_ROOT

RUN apk update && \
    apk add python make g++ && \
    yarn global add npm @vue/cli @vue/cli-init nuxt
#    yarn global add npm @vue/cli @vue/cli-init nuxt create-nuxt-app
