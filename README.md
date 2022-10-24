# Cartelera Cultural de Ensenada - REST API

RESTful API for [Cartelera Cultural de Ensenada](https://carteleraculturalens.com),
built with the following technologies:

- `express`
- `mongoose`
- `typescript`
- `fastest-validator`
- `sharp`

and more awesome open-source projects.

## Install

```
git clone https://github.com/ThyDevourer/carteleracultural-api.git
cd carteleracultural-api
yarn
```

## Build

```
yarn build
```

## Run

Development:

```
yarn dev
```

Production:

```
yarn start
```

## Usage with docker compose

```
cp docker-compose.example.yml docker-compose.yml
# make appropriate changes to docker-compose.yml or create .env file
docker compose up -d
```
