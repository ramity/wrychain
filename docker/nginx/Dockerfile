FROM nginx:bookworm

RUN apt update
RUN apt upgrade -y

RUN mkdir -p /etc/nginx/ssl

# Generate the key and cert (valid for 1 year)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/wrychain.key \
  -out /etc/nginx/ssl/wrychain.crt \
  -subj "/C=US/ST=AR/L=Fayetteville/O=Wrychain/OU=IT Department/CN=wrychain.com"

COPY ./docker/nginx/wrychain.conf /etc/nginx/conf.d/wrychain.conf
