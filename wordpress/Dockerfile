FROM php:8.2-apache

# Install SQLite extensions
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite module for WordPress permalinks
RUN a2enmod rewrite

# Copy WordPress files into the Apache webroot
COPY . /var/www/html/

# Set correct ownership for WordPress files
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
