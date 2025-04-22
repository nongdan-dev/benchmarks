FROM node:18

WORKDIR /app

COPY ./docker/node-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh

CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
