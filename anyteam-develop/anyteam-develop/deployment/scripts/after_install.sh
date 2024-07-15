#!/usr/bin/env bash

# Please Edit
region=ap-northeast-1
owner=undo-dev
group=undo-admin
pj_root=anyteam
pj_name=cms

# Please do not edit
pj_dir=/usr/src/${pj_root}
instance_id=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
environment=$(aws --region=${region} ec2 describe-tags \
  --filters="Name=resource-id,Values=${instance_id}" \
  --query='Tags[?Key==`Environment`].Value' --output=text)
role=$(aws --region=${region} ec2 describe-tags \
  --filters="Name=resource-id,Values=${instance_id}" \
  --query='Tags[?Key==`Role`].Value' --output=text)

# Function
## Error handling
function error_handler() {
  if [ "$?" != "0" ]; then
    echo 'Error!!'
    exit 1
  fi
}

## Generate .env file
## 
## Arguments:
##   $1: application_type
##   $2: directory
function generate_env() {
  echo "---> current .env file is for $1"
  aws --region=${region} ssm get-parameter \
    --name=/anyteam/${environment}/env/$1 \
    --query=Parameter.Value \
    --output=text \
    --with-decryption | base64 --decode > ${pj_dir}/$2/.env
  error_handler
  echo -n -e "\n" >> ${pj_dir}/$2/.env
}


# Process

echo 'Change directory to pj_dir'
cd ${pj_dir} || exit

echo 'Set pj_name'
if [ "${role}" == "Web" ]; then
  pj_name='web'
fi

# generate .env
echo 'Generate api .env file'
generate_env api api
echo 'Generate cms .env file'
generate_env cms cms/app
echo 'Generate portal .env file'
generate_env portal portal/app
echo 'Generate web .env file'
generate_env web web

# yarn install & build for api
cd ${pj_dir}/api
echo 'Create openapi.json if not exist'
if [ ! -e "openapi.json" ]; then
  touch openapi.json
  error_handler
  chmod 777 openapi.json
  error_handler
fi
echo 'Run `yarn install` for api'
yarn install
error_handler
echo 'Run `yarn build` for api'
yarn build
error_handler
chmod -R 777 ${pj_dir}/api/log

# application for cms server
if [ "${pj_name}" == "cms" ]; then
  # migration
  echo 'Run `yarn migration:run`'
  cd ${pj_dir}/api
  yarn migration:run
  error_handler
  # yarn install & build for cms
  echo 'Run `yarn install` for cms'
  cd ${pj_dir}/cms/app
  yarn install
  error_handler
  echo 'Run `yarn build` for cms'
  yarn build
  error_handler
  echo 'Run `yarn generate` for cms'
  yarn generate
  error_handler
fi

# application for web server
if [ "${pj_name}" == "web" ]; then

  # yarn install & build for portal
  echo 'Run `yarn install` for portal'
  cd ${pj_dir}/portal/app
  yarn install
  error_handler
  echo 'Run `yarn build` for portal'
  yarn build
  error_handler
  echo 'Run `yarn generate` for portal'
  yarn generate
  error_handler

  # yarn install & build for web
  echo 'Run `yarn install` for web'
  cd ${pj_dir}/web
  yarn install
  error_handler
  echo 'Run `yarn build:fe` for web'
  yarn build:fe
  error_handler
  echo 'Run `yarn build:bff` for web'
  yarn build:bff
  error_handler

  cd ${pj_dir}

  # Install forever if not installed
  which forever
  if [ "$?" != "0" ]; then
    npm install -g forever
    error_handler
    forever --version
  fi

  echo 'Run `forever --version` before api'
  forever --version
  error_handler
  forever list | grep ${pj_dir}/api/dist/main.js
  if [ "$?" != "0" ]; then
    # api start
    echo 'Run `forever start for api`'
    forever start --workingDir ${pj_dir}/api ${pj_dir}/api/dist/main.js
    error_handler
  else
    # api restart
    echo 'Run `forever restart for api`'
    forever restart --workingDir ${pj_dir}/api ${pj_dir}/api/dist/main.js
    error_handler
  fi

  echo '`Run forever --version` before web'
  forever --version
  error_handler
  forever list | grep ${pj_dir}/web/dist/main.js
  if [ "$?" != "0" ]; then
    # web start
    echo 'Run `forever start for web`'
    forever start --workingDir ${pj_dir}/web ${pj_dir}/web/dist/main.js
    error_handler
  else
    # web restart
    echo 'Run `forever restart for web`'
    forever restart --workingDir ${pj_dir}/web ${pj_dir}/web/dist/main.js
    error_handler
  fi
fi

# set nginx config
echo 'Link to Nginx config'
ln -nfs ${pj_dir}/deployment/conf/nginx/${environment}/${pj_name}.conf /etc/nginx/conf.d/${pj_name}.conf
error_handler

echo 'Check nginx config'
sudo nginx -t
error_handler

echo 'Reload nginx Processes'
sudo nginx -s reload
error_handler
