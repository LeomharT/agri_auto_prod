#!/bin/bash
export version=xxxVersion
export app_name=xxxapp_name

sed -i "s/app-name/$app_name/g" ./docker-compose.yaml
sed -i "s/image-version/$version/g" ./docker-compose.yaml


re=`docker images -f "dangling=true" -q`
if [ -n "$re" ];then
  docker rmi  -f `docker images -f "dangling=true" -q`
else
  echo ''
fi

docker-compose --compatibility down

re1=`docker images image.server:8082/iotcloud/$app_name:$version -q`
if [ -n "$re1" ];then
  docker rmi image.server:8082/iotcloud/$app_name:$version
else
  echo ''
fi


docker-compose --compatibility up -d
docker-compose --compatibility  logs -f $app_name > /var/log/application/$app_name/$app_name &
#kubectl create -f deployment-$app_name.yaml
