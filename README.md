# Divorce Decree Absolute

## Getting started

#### Config

For development only config, rename the `config/dev_template.yaml` file to `config/dev.yaml`. Running the app with the node environment set to `dev` will ensure this file is used.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LaunchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

#### Install dependencies

```shell
$ yarn install
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
$ yarn test
```

#### Run Functional tests locally

```shell
$ yarn test:functional
```

#### Run Functional tests locally against AAT

* Connect to the VPN

* Make a copy of `config/example-local-aat.yml` as `config/local-aat.yml` (which is ignored by git)

* Substitute any secret values in ***local-aat.yml*** from SCM - Do not add/commit secrets to the example file!

* If you want to point to a PR, modify `tests.functional.url` accordingly.

* Run ```NODE_ENV=aat yarn test:functional```. This would your tests to pick up the new `local-aat.yml`.
