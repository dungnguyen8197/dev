# 概要

- 構成はモノレポ（API, WEB, CMS ... を 1 レポジトリにおさめている）
- 基本、vscode を使用する前提のもと作成

# Git ルール

## コミットログ

- モノレポにしている都合、各アプリケーションのコミットが１つにまとまってしまう為、コミットログから変更箇所をわかりやすくする
- 形式： `{Action}: {Application} / {Context}`
- Action
  - Add ... Add New Page, API, etc
  - Update ... Update Page, API, etc
  - Delete ... Delete Page, API, etc
  - Fix ... Bug Fix
- Application
  - api
  - cms
  - portal
  - web
- Context
  - 対応内容を記述
- ex. `Update: api / チーム取得APIのレスポンス改修`

## ブランチ名称

- 他プロジェクトと基本的に同一規則
- 形式： `{課題Key}-{対応内容}`
- ex. `feature/LOCKERZ-112-add-login-page`
- main ブランチから feature ブランチを作成する

# 環境構築

※ うまくいかない部分あれば教えてください

1. Docker ビルド＆立ち上げ

```
$ docker-compose build
$ docker-compose up -d
```

- 以降コマンド実行時に `error Command failed with signal "SIGKILL".` でるようなら Docker の割り当てメモリを増やしてリトライしてください。

2. DynamoDB のテーブル作成

```
$ aws dynamodb create-table \
--table-name ReadNotification \
--attribute-definitions AttributeName=UserId,AttributeType=N AttributeName=NotificationId,AttributeType=N \
--key-schema AttributeName=UserId,KeyType=HASH AttributeName=NotificationId,KeyType=RANGE \
--billing-mode PAY_PER_REQUEST \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```

ユーザーごとのお知らせ既読チェックに用いる local の dynamodb つくります。詳細は `dynamodb/` を参照。

- ※ aws-cli は用意。また、credential はテキトーに用意する必要あり？

3. DB 作成

```
$ docker-compose exec api ash

# yarn install
# yarn build
# yarn migration:run
```

- 別タブを開き、以下実行してテーブルの確認
  ※ yarn install 時にエラーでるようなら 本 README 内の **bcrypt のエラー** を試してみてください。

```
$ docker-compose exec db bash

$ psql -U root -d anyteam
anyteam=# \dt
```

administrators, competitions.. などの一覧が表示されているなら OK です。あとはそれぞれのコンテナに接続し、作業します。

## API 開発（3000 番ポート） - /api/

- コンテナへの接続

```
$ docker-compose exec api ash
```

- 初回

```
# yarn install
# yarn seed:run ... 疑似データ (シードデータ) 追加
```

- API アプリケーション起動（開発用）

```
# yarn start:dev
```

> localhost:3000/api/{api version}/{path}

#### ステップ実行を行いたい場合

- ステップ実行を実施したい場合は、以下のコマンドにてアプリケーションを起動する
- また「Run and Debug」タブを開き、「API debug（anyteam）」が選択された状態で「Start Debugging（F5）」を実行
- あとは Break Point を立てて確認する

```
$ yarn start:debug:step
```

#### ログ

- エラーログは `api/log/trace.log` に吐き出される
- ※ ローカルではアプリケーション起動時のログも含まれる
- TODO: ローテーションを組む必要あり
  https://qiita.com/Kento75/items/3c6ae1ba1b433ae433a3

#### nest cli

- よく使うものだけ一旦

```
# nest g service users
# nest g controller users
# nest g module users
```

#### ローカル環境での API 実行テスト

- postman を使用するでも全然いいのだが、コードで残せると楽かなと思い導入してみる

1. rest client のインストール
2. api コンテナを立ち上げ、アプリケーションを起動する ex. `yarn start:dev`
3. api-local-test 配下の http ファイルを開き、send request を実施する

#### bcrypt のエラー

```
internal/modules/cjs/loader.js:1144
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Error loading shared library /usr/src/app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: Exec format error
    at Object.Module._extensions..node (internal/modules/cjs/loader.js:1144:18)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
    at Module.require (internal/modules/cjs/loader.js:974:19)
    at require (internal/modules/cjs/helpers.js:92:18)
    at Object.<anonymous> (/usr/src/app/node_modules/bcrypt/bcrypt.js:6:16)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
    at Module.load (internal/modules/cjs/loader.js:950:32)
    at Function.Module._load (internal/modules/cjs/loader.js:790:14)
[nodemon] app crashed - waiting for file changes before starting...
```

- 環境構築時に上記のようなエラーが出る可能性がある
- コンテナに接続し、下部記載の方法で解消を行うことができる
- [参照記事](https://tkzawa.netlify.app/201101/)

```
# apk add --no-cache make gcc g++ python
# npm rebuild bcrypt --build-from-source
```

- TODO: Dockerfile に処理を組み込む

## WEB 開発（3001 番ポート） - /web/

- コンテナへの接続

```
$ docker-compose exec web ash
```

- 初回

```
# yarn install
```

- assets ビルド ( FE )

```
# yarn build:fe:dev
```

- WEB アプリケーション起動（開発用） ( BFF )

```
# yarn start:dev
```

> localhost:3001

※ FE と BFF 両方さわる場合はそれぞれ起動しましょう
※ `$ yarn start:debug:step` で 「WEB debug（anyteam）」 選択で API 同様にステップ実行できます。

## CMS 開発（3002 番ポート） - /cms/

```
$ docker-compose exec cms ash
# cd app
# yarn install
# yarn dev
```

> localhost:3002

## API DOCS（9000 番ポート）

- TODO: openapi.json 生成のフロー見直す
- api コンテナで html を生成する

```
$ docker-compose exec api ash

# yarn install
# yarn start:dev ... openapi.jsonを生成
# yarn redoc:export ... openapi.jsonからredoc-static.htmlを生成
```

> localhost:9000

## DB

- コンテナへの接続

```
$ docker-compose exec db bash
```

- db 接続

```
# psql -U root -d anyteam
```

# Coding Guideline

## 命名規則

- DTO などの HTTP の I/O の型宣言クラスは以下命名規則とする
  - Input: Suffix を`Request` 例: `TeamRegisterRequest`
  - Output: Suffix を`Response` 例: `TeamRegisterResponse`
