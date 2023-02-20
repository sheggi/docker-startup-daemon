# NUXT_DEV_SERVER=true

server {
    listen 127.0.0.1:80;
    server_name nuxt-dev-container.sheggi.io www.nuxt-dev-container.sheggi.io *.nuxt-dev-container.sheggi.io;
    root /;
    charset utf-8;
    client_max_body_size 128M;

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log "/Users/sheggi/.config/valet/Log/nginx-error.log";

    #error_page 404 "/Users/sheggi/.composer/vendor/laravel/valet/server.php";

    location / {
        proxy_pass http://0.0.0.0:3001;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Client-Verify   SUCCESS;
        proxy_set_header   X-Client-DN       $ssl_client_s_dn;
        proxy_set_header   X-SSL-Subject     $ssl_client_s_dn;
        proxy_set_header   X-SSL-Issuer      $ssl_client_i_dn;
        proxy_set_header   X-NginX-Proxy true;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_http_version 1.1;
        proxy_read_timeout 1800;
        proxy_connect_timeout 1800;
        chunked_transfer_encoding on;
        proxy_redirect off;
        proxy_buffering off;
    }

    location ~ /\.ht {
        deny all;
    }
}
