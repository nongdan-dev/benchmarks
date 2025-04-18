# FROM rustlang/rust:nightly

# WORKDIR /app

# # Copy các file cần thiết trước, để cache các layer
# COPY Cargo.toml Cargo.lock ./

# # Tạo thư mục mục tiêu để lưu các phụ thuộc
# RUN mkdir src && echo "fn main() {}" > src/main.rs
# RUN cargo build --release

# # Copy phần còn lại của project
# COPY . .

# RUN cargo build --release

# CMD ["./target/release/rust"]


FROM rustlang/rust:nightly

WORKDIR /app
COPY . .

RUN cargo build --release

CMD ["./target/release/rust"]
