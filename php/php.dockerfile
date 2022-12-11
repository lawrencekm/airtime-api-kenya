FROM php:7.2-fpm
COPY ./ /var/www/html/

RUN apt-get update -y && \ 
    apt-get install -y libmcrypt-dev && \ 
    pecl install mcrypt-1.0.1 && \ 
    docker-php-ext-enable mcrypt 