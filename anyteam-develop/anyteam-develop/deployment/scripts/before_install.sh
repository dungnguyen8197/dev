#!/usr/bin/env bash

# Function
## Error handling
function error_handler() {
  if [ "$?" != "0" ];then
    echo 'Error!!'
    exit 1
  fi
}

# Install font for create image on server.
if [ ! -e /usr/share/fonts/Noto_Serif_JP ]; then
  echo 'Run `yum install -y fontconfig wget`'
  yum install -y fontconfig wget
  error_handler
  echo 'Run `mkdir -m 777 -p /usr/share/fonts /usr/share/fonts/Noto_Serif_JP`'
  mkdir -m 777 -p /usr/share/fonts /usr/share/fonts/Noto_Serif_JP
  error_handler
  echo 'Run `wget https://fonts.google.com/download?family=Noto%20Serif%20JP -O /usr/share/fonts/tmp`'
  wget https://fonts.google.com/download?family=Noto%20Serif%20JP -O /usr/share/fonts/tmp
  error_handler
  echo 'Run `chmod -R 777 /usr/share/fonts/tmp`'
  chmod -R 777 /usr/share/fonts/tmp
  error_handler
  echo 'Run `unzip /usr/share/fonts/tmp -d /usr/share/fonts/Noto_Serif_JP`'
  unzip /usr/share/fonts/tmp -d /usr/share/fonts/Noto_Serif_JP
  error_handler
  echo 'Run `rm -rf /usr/share/fonts/tmp`'
  rm -rf /usr/share/fonts/tmp
  error_handler
  echo 'Run `mkdir -m 777 -p /usr/src/app/images/rewards/output`'
  mkdir -m 777 -p /usr/src/app/images/rewards/output
  error_handler
  echo 'Run `fc-cache -rv`'
  fc-cache -rv
  error_handler
fi