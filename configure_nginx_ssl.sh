#!/bin/bash

# Run Certbot to obtain certificates
certbot --nginx --non-interactive --agree-tos --email test3@sitcloud.in -d sitcloud.in

# Define the Nginx configuration file path
NGINX_CONF="/etc/nginx/nginx.conf"

# Check if the server block for port 8082 exists
if grep -q "listen 8082;" $NGINX_CONF; then
    # Add SSL certificate paths within the 8082 server block
    sed -i '/listen 8082;/a \
    ssl_certificate /etc/letsencrypt/live/sitcloud.in/fullchain.pem; \
    ssl_certificate_key /etc/letsencrypt/live/sitcloud.in/privkey.pem; \
    include /etc/letsencrypt/options-ssl-nginx.conf; \
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;' $NGINX_CONF

    # Update listen directive to include SSL
    sed -i 's/listen 8082;/listen 8082 ssl;/' $NGINX_CONF
else
    echo "Server block for port 8082 not found in the configuration."
fi

# Reload Nginx to apply changes
nginx -s reload
