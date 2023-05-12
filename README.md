# kikora hax

## Description

Server side of the kikora hax userscript. Facilitates sharing answers for questions on kikora.

## Installation

1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone this repository
3. Run `npm install` in the repository directory
4. Run `npm start` in the repository directory

Using docker

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Clone this repository
3. Run `docker build -t kikora-hax .` in the repository directory or pull using `docker pull ghcr.io/danielv123/kikorahax:latest`
4. Run `docker run -p 3000:3000 kikora-hax`

Using docker-compose

    docker-compose up -d
