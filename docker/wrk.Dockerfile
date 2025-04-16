FROM ubuntu:20.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y git build-essential libssl-dev unzip curl

# Clone and build wrk
WORKDIR /wrk
RUN git clone https://github.com/wg/wrk.git . && make

# Copy compiled binary to a common path
RUN cp ./wrk /usr/local/bin/wrk && chmod +x /usr/local/bin/wrk

# Optional: Add Lua script directory if needed
WORKDIR /scripts




# FROM debian:bullseye

# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libssl-dev \
#     git \
#     unzip \
#     curl

# WORKDIR /wrk
# RUN git clone https://github.com/wg/wrk.git . && make

# # ✅ Thêm dòng này để có thể chạy `wrk` từ bất kỳ đâu
# RUN cp wrk /usr/local/bin/

# WORKDIR /scripts
# ENTRYPOINT ["sh"]


# FROM debian:bullseye-slim

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     ca-certificates \
#     unzip \
#     git build-essential libssl-dev lua5.3 liblua5.3-dev && \
#     rm -rf /var/lib/apt/lists/*

# WORKDIR /wrk

# RUN git clone https://github.com/wg/wrk.git . && make

# ENTRYPOINT ["./wrk"]
