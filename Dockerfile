FROM mhart/alpine-node:8.9 as builder
WORKDIR /app
COPY . /app
RUN apk add --no-cache g++
RUN npm install

FROM mhart/alpine-node:8.9
WORKDIR /app
COPY --from=builder /app /app
CMD ["npm", "start"]
