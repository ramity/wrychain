FROM php:8.3.21-fpm-bookworm

# Update and deps
RUN apt update
RUN apt upgrade -y
RUN apt install -y libzip-dev
RUN apt install -y zip unzip
RUN apt install -y apt-utils

# Add PHPUnit driver for testing
RUN apt install -y chromium-driver

# PHP extensions

# PDO for database interface
RUN docker-php-ext-configure pdo_mysql
RUN docker-php-ext-install pdo_mysql

# ICU -> INTL for localization data
RUN apt install -y libicu-dev
RUN docker-php-ext-configure intl
RUN docker-php-ext-install intl

# OPcache as php accelerator
RUN docker-php-ext-configure opcache
RUN docker-php-ext-install opcache

# Zip for programmatic compression and archive management
RUN docker-php-ext-install zip

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

WORKDIR /symfony

# Be sure to use --no-git when creating a new project
# Example:
# symfony new logly --version="7.2.x" --webapp --no-git

# ENTRYPOINT sleep infinity

# For Dev use only
# ENTRYPOINT symfony server:start --listen-ip=0.0.0.0

CMD [ "composer update && php-fpm" ]
