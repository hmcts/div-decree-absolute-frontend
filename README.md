# Divorce Decree Absolute

## Getting started

#### Install dependencies

```shell
yarn install
```

#### Start application

Run Redis DB using Docker

```shell
docker-compose up redis
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
yarn test
```

#### Run Functional tests locally

```shell
yarn test:functional
```

#### Run Functional tests locally against AAT

* Connect to the VPN

* Make a copy of `config/example-local-aat.yml` as `config/local-aat.yml` (which is ignored by git)

* Substitute any secret values in ***local-aat.yml*** from SCM - Do not add/commit secrets to the example file!

* If you want to point to a PR, modify `tests.functional.url` accordingly.

* Run ```NODE_ENV=aat yarn test:functional```. This would your tests to pick up the new `local-aat.yml`.
