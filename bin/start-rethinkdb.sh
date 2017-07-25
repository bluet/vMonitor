#https://hub.docker.com/_/rethinkdb/

docker run --name rethinkdb -v "$PWD:/data" -d rethinkdb

docker inspect --format '{{ .NetworkSettings.IPAddress }}' rethinkdb


