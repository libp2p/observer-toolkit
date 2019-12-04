# Verdaccio with simple local storage

Based on https://github.com/verdaccio/docker-examples/tree/master/docker-local-storage-volume

This allows a Verdaccio local NPM registry to be spun up by running `docker-compose up`.

By default, login is not required. This can be changed by commenting out this line in `conf/config.yaml`, then configuring `conf/htpasswd`:

```
      max_users: -1
```

Contains

* conf: Configuration file and default user httpasswd
* storage: A published default package with 2 versions.

```bash
$> docker-compose up
```

## Login

If you want to login into the Verdaccio instance created via these Docker Examples, please try:

Username: jpicado
Password: jpicado
