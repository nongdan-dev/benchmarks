# Sử dụng Golang image làm base
FROM golang:1.19-alpine

# Cài đặt thư viện nếu cần
WORKDIR /app
COPY . .

# Biên dịch ứng dụng Go
RUN go build -o app .

# Chạy ứng dụng và xuất log ra stdout/stderr
CMD ["./app"]
