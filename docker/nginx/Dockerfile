FROM nginx:bookworm

RUN apt update
RUN apt upgrade -y

RUN mkdir -p /etc/nginx/ssl

# Copy ssl config to temp dir
COPY ./docker/nginx/wrychain-ssl.conf.local /tmp/wrychain-ssl.conf

# Generate the key and cert (valid for 1 year)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /etc/nginx/ssl/wrychain.key -out /etc/nginx/ssl/wrychain.crt -config /tmp/wrychain-ssl.conf

# Generate mobile cert
# RUN openssl pkcs12 -export -out mobile-cert.p12 -inkey /etc/nginx/ssl/wrychain.key -in /etc/nginx/ssl/wrychain.crt

COPY ./docker/nginx/wrychain.conf.local /etc/nginx/conf.d/wrychain.conf
