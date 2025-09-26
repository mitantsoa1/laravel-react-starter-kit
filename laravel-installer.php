#!/usr/bin/env php
<?php

// laravel-installer.php

echo "Installing the Starter Kit...\n";

system('rm -rf .git');

echo "Installing Composer Dependencies...\n";
system('composer install --no-dev --optimize-autoloader');

echo "Construction of frontend assets...\n";
system('npm ci --no-dev && npm run build');

if (!file_exists('.env')) {
    copy('.env.example', '.env');
    echo ".env file created.\n";
}

echo "Generating the application key...\n";
system('php artisan key:generate');

echo "Installation completed successfully !\n";
echo "Don't forget to configure your database in the .env file before starting the migrations.\n";
?>