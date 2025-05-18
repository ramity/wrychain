FROM redis:8.0.1-bookworm
COPY ./docker/redis/redis-full.conf /usr/local/etc/redis/redis-full.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis-full.conf" ]
