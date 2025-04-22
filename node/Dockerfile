FROM node:23.11

RUN npm config set -g update-notifier false
RUN npm config set -g loglevel error
RUN npm config set -g audit false
RUN npm config set -g fund false

COPY ./node/docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

WORKDIR /repo/node
CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
