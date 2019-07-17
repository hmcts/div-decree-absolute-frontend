# Divorce Decree Absolute

## Getting started

#### Install dependencies

```shell
$ yarn install
```

#### Start application

Run Redis DB using Docker

```shell
docker-compose up
```

To start running the application on ```https://localhost:3000```. (Note https not http)

```shell
yarn dev
```

This will create a new endpoint of ```"/session"``` where you can view and edit the current session. 
(Note: each time you login/logout of IDAM the session will be reset)

```shell
yarn mocks
```

#### Test application

```shell
$ yarn test
```

#### Run Functional tests locally

```shell
$ yarn test:functional
```

#### Run Functional tests locally against AAT

1. Create remote-config.json file 
2. Copy SCM config
3. Add "TEST_URL" with AAT url
4. Run `yarn test:functional:remote`
