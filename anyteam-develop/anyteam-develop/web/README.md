# 初期構築用のメモのため特に確認不要

### コンテナ
```
$ docker-compose exec web
```

### Express
- ビルドして起動

```
$ npx tsc --project tsconfig.bff.json
$ node dist/main.js
```

- 起動（変更を検知する為、ビルド不要）

```
$ nodemon
```

### Vue


cd /var/www/html/web

yarn add express

touch app.js (port 3001)

node app.js

yarn add ejs


yarn add vue@next
yarn add --dev webpack webpack-cli
yarn add --dev vue-loader@next @vue/compiler-sfc
yarn add --dev typescript
yarn add --dev ts-loader
yarn add --dev node-sass css-loader

yarn add --dev terser-webpack-plugin optimize-css-assets-webpack-plugin
yarn add --dev babel-loader @babel/core @babel/preset-env 
yarn add --dev vue-template-compiler
yarn add --dev vue-style-loader
yarn add --dev sass-loader sass
yarn add --dev mini-css-extract-plugin