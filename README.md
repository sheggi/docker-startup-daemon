# docker start up daemon

listen for same port as provided by docker container. if container not running, start it automatically

## pre requisite

put this project in same directory as other projects.

bind domain to port `3001`.
for example use proxy pass with nginx. see [nginx config](./nginx/nuxt-dev-container.sheggi.io)

expose docker container to port `3001` see [docker-compose config](./docker/docker-compose.yml)

## start

```bash
node index.mjs
```

then open http://nuxt-dev-container.sheggi.io
the deamon tryes to start the docker container from `../nuxt-dev-container`

you'll find a status page under http://localhost:3999