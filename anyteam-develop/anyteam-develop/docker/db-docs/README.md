## これは

- s3 に DB 定義をアップロードします。

## 前提

- `docker-compose up` 後
- AWS CLI インストール済み
- `~/.aws/credentials`に以下 S3 にアクセスできるプロファイル設定済み

```
[anyteam]
aws_access_key_id = {AWS KEY}
aws_secret_access_key = {AWS SECRET KEY}
```

## アップロード

```
$ sh upload.sh
```
