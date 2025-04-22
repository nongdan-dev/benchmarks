FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install -y git build-essential libssl-dev unzip curl

# wrk is not available via apt in Ubuntu 20.04 official repos
RUN git clone https://github.com/wg/wrk.git /wrk
WORKDIR /wrk
RUN make
RUN cp ./wrk /usr/local/bin/wrk
RUN chmod 755 /usr/local/bin/wrk

WORKDIR /app

COPY ./docker/wrk-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh

CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
