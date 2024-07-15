# Deployment

## Setup

### Install pstore
[pstore](https://github.com/oreno-tools/pstore) is a tool for storing data in the parameter store.

```sh
$ curl -sLJO https://github.com/oreno-tools/pstore/releases/download/v0.0.1/pstore_darwin_amd64
$ chmod 744 pstore_darwin_amd64
$ mv pstore_darwin_amd64 /usr/local/bin/pstore
```

### storing to parameter store

- if updated
```sh
# your profile
$ export AWS_PROFILE=anyteam
$ export AWS_REGION=ap-northeast-1

# for develop
## for api dev
$ cat .env | base64 | pstore --put --secure -name=/anyteam/dev/env/api -overwrite
## for cms dev
$ cat .env | base64 | pstore --put --secure -name=/anyteam/dev/env/cms -overwrite
## for portal dev
$ cat .env | base64 | pstore --put --secure -name=/anyteam/dev/env/portal -overwrite
## for web dev
$ cat .env | base64 | pstore --put --secure -name=/anyteam/dev/env/web -overwrite

# for production
## for api production
$ cat .env | base64 | pstore --put --secure -name=/anyteam/prd/env/api -overwrite
## for cms production
$ cat .env | base64 | pstore --put --secure -name=/anyteam/prd/env/cms -overwrite
## for portal production
$ cat .env | base64 | pstore --put --secure -name=/anyteam/prd/env/portal -overwrite
## for web production
$ cat .env | base64 | pstore --put --secure -name=/anyteam/prd/env/web -overwrite
```

- If you use linux, it needs base64 option like below.
```sh
$ cat .env | base64 --wrap=0 | pstore --put --secure -name=/XXX -overwrite
```

## Let's Deploy!!

```sh
$ git push -u origin xxxxx
```
