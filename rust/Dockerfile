FROM rust:1.86

ENV CARGO_HOME="/repo/rust/.rust-cache"

COPY ./rust/docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

WORKDIR /repo/rust
CMD ["/bin/sh"]
ENTRYPOINT ["/docker-entrypoint.sh"]
