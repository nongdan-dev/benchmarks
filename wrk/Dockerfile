FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update

# wrk is not available via apt in ubuntu official repos
RUN apt-get install -y git build-essential libssl-dev unzip
RUN git clone https://github.com/wg/wrk.git /wrk
WORKDIR /wrk
RUN git checkout a211dd5a7050b1f9e8a9870b95513060e72ac4a0
RUN make
RUN cp ./wrk /usr/local/bin/wrk
RUN chmod 755 /usr/local/bin/wrk

# wrk2
RUN apt-get install -y git build-essential libssl-dev unzip zlib1g-dev
RUN git clone https://github.com/giltene/wrk2.git /wrk2
WORKDIR /wrk2
RUN git checkout 44a94c17d8e6a0bac8559b53da76848e430cb7a7
RUN make
RUN cp ./wrk /usr/local/bin/wrk2
RUN chmod 755 /usr/local/bin/wrk2

# use netcat to wait for other services host/port
RUN apt-get install -y netcat

COPY ./wrk/docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

WORKDIR /repo/wrk
CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
