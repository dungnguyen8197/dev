# 概要
- local dynamodb
- ユーザーごとのお知らせ既読チェックに用いることを想定

# 構築

- 以下の使用サンプルの `create table`を実施する


# AWS CLIによる使用サンプル

- create table
```
$ aws dynamodb create-table \
--table-name ReadNotification \
--attribute-definitions AttributeName=UserId,AttributeType=N AttributeName=NotificationId,AttributeType=N \
--key-schema AttributeName=UserId,KeyType=HASH AttributeName=NotificationId,KeyType=RANGE \
--billing-mode PAY_PER_REQUEST \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```

- table list
```
$ aws dynamodb list-tables \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```

- put item
```
$ aws dynamodb put-item \
--table-name ReadNotification \
--item '{"UserId": {"N": "1"}, "NotificationId": {"N": "1"}}' \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```

- get item
```
$ aws dynamodb get-item \
--table-name ReadNotification \
--key '{"UserId": {"N": "1"}, "NotificationId": {"N": "1"}}' \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```

- query
```
$ aws dynamodb query \
--table-name ReadNotification \
--key-conditions '{"UserId":{"ComparisonOperator":"EQ", "AttributeValueList":[{"N":"1"}]}}' \
--endpoint-url http://localhost:8888 \
--region=ap-northeast-1
```