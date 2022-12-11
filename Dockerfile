FROM php:7.2-cli
RUN apt-get update -y && \ 
    apt-get install -y libmcrypt-dev && \ 
    pecl install mcrypt-1.0.1 && \ 
    docker-php-ext-enable mcrypt 

COPY . /usr/src/myapp
WORKDIR /usr/src/myapp

CMD [ "php", "-a" ]