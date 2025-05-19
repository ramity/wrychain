#!/bin/bash

cp -u docker/mariadb/.env docker/mariadb/.env.local
cp -u docker/nginx/wrychain.conf docker/nginx/wrychain.conf.local
cp -u docker/node/.env docker/node/.env.local
cp -u docker/phpmyadmin/.env docker/phpmyadmin/.env.local
cp -u docker/redis/redis-full.conf docker/redis/redis-full.conf.local
cp -u docker/symfony/.env docker/symfony/.env.local
