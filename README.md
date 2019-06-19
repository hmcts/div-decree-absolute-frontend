# Divorce Decree Absolute

## Getting started

#### Install dependencies

```shell
$ yarn install
```

#### Start application

Run redis DB using Docker

```shell
docker-compose up
```

Use the following commands in different terminal sessions:

```shell
yarn mocks
```

```shell
yarn dev
```

The application will now be running on ```https://localhost:3000```. (Note https not http)

Locally this will also create a new URL of ```"/session"``` where you can view and edit the current session
(Note: each time you login/logout of IDAM the session will be reset)

#### Test application

```shell
$ yarn test
```

#### Run Functional tests locally

1. create local.yml file in config folder with the contents:
```yml
tests:
  functional:
    proxy:
    proxyByPass:
```

2. run
```shell
$ yarn test:functional
```

#### Run Functional tests locally against AAT

1. Create remote-config.json file 
2. Copy SCM config
3. Add "TEST_URL" with AAT url
4. Run `yarn test:functional:remote`