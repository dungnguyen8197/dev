#!/usr/bin/env bash

## Check AWS CLI
aws --version

## Set AWS Credentials
export AWS_PROFILE=anyteam
export AWS_REGION=ap-northeast-1

aws s3 sync ./output s3://docs.anyteam.jp/db
