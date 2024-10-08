FROM golang:1.23-alpine AS backend-builder
RUN apk add --no-cache git
RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN go mod download
RUN go build -o main ./main.go
CMD ["/app/main"]