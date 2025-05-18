#!/bin/bash

cp -u docker/mariadb/.env.dist docker/mariadb/.env
cp -u docker/nginx/wrychain.conf.dist docker/nginx/wrychain.conf
cp -u docker/node/.env.dist docker/node/.env
cp -u docker/phpmyadmin/.env.dist docker/phpmyadmin/.env
cp -u docker/redis/redis-full.conf.dist docker/redis/redis-full.conf
cp -u docker/symfony/.env.dist docker/symfony/.env
