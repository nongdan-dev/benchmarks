FROM golang:1.24

COPY ./go/docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

WORKDIR /repo/go
CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
