# NodeJs/Typescript API Boilerplate

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ofuochi/node-typescript-boilerplate/) [![GitHub issues](https://img.shields.io/github/issues/ofuochi/node-typescript-boilerplate)](https://github.com/ofuochi/node-typescript-boilerplate/issues) [![GitHub stars](https://img.shields.io/github/stars/ofuochi/node-typescript-boilerplate)](https://github.com/ofuochi/node-typescript-boilerplate/stargazers) [![GitHub forks](https://img.shields.io/github/forks/ofuochi/node-typescript-boilerplate)](https://github.com/ofuochi/node-typescript-boilerplate/network) [![GitHub license](https://img.shields.io/github/license/ofuochi/node-typescript-boilerplate)](https://github.com/ofuochi/node-typescript-boilerplate/blob/master/LICENSE)

## To Contribute

Please feel free to contribute to this project. To contribute, please follow this [instructions](https://github.com/ofuochi/node-typescript-boilerplate/blob/master/CONTRIBUTING.md)

## Running the app

> **NOTE**: These instructions require [MongoDB](https://docs.mongodb.com/manual/installation/) and [Node.js](https://nodejs.org/en/download/) to be installed on your environment.

### Clone the Repository

```sh
git clone https://github.com/ofuochi/node-typescript-boilerplate.git
cd node-typescript-boilerplate
```

### Install Dependencies

```sh
npm install
```

### Copy Files

#### Sample `env` File into a `.env` File

Copy the sample environment file to a new environment file that holds the sensitive settings of your application.

```sh
cp env.sample .env
```

### Run the App

```sh
npm run start
```

Or run in development watch mode. This uses [nodemon](https://github.com/remy/nodemon) to watch for file changes.

```sh
npm run dev
```

### DB Seeding

The first time the application runs, MongoDB is seeded with default Tenant and default Admin User.

1. Default tenant name is **Default** (obvioulsy)
2. Default admin login detail;
   - Username: **admin**
   - Password: **123qwe**

### Swagger API Documentation

Open the URL `http://localhost:3000/api-docs` to view the the swagger documentation of the endpoints.

This will contain all the endpoints you expose to the client. Once you add a new endpoint, this endpoint will automatically be added! How cool is that?😎.
Concentrate on building the functionality and business logic of your application. Swagger will do the documentation for you!.

Since this is a multi-tenant application, to authenticate (sign-in or sign-up), you need to pass a tenant ID in the header so that the application will know which tenant
you are referencing during authentication.

To get the tenant details call the "get tenants" endpoint. For example, to get the details of the **Default** tenant, I'll call the endpoint
`http://localhost:3000/api/v1/tenants/default`. Good thing is, you can do this directly on Swagger!

### Run Tests

Run test once

```sh
npm run test
```

Or re-run test on every file change (watch mode)

```sh
npm run test-watch
```

## REST Services

The application exposes a few REST endpoints which require you to pass `x-tenant-id` header. First, call the tenant endpoint `/api/v1/tenant` to get all the available tenants. Use any of the tenant IDs as the value for `x-tenant-id`

- `HTTP` `GET` `/api/v1/tenants`
- `HTTP` `GET` `/api/v1/tenants/:query`
- `HTTP` `GET` `/api/v1/secured` (Requires a valid `x-auth-token` header)

You can use the following code snippet to call the secured endpoint:

```js
fetch("http://localhost:3000/api/v1/secure", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"x-tenant-id": "TENANT_ID",
		"x-auth-token": "SOME_VALID_CREDENTIAL"
	}
})
	.then(r => {
		if (r.status === 200) {
			r.json().then(j => console.log(j));
		} else {
			console.log("ERROR", r.status);
		}
	})
	.catch(e => console.log(e));
```

You can use the following code snippet to call the secured endpoint with an invalid `x-auth-token` header:

```js
fetch("http://localhost:3000/api/v1/secure", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"x-tenant-id": "TENANT_ID",
		"x-auth-token": "SOME_WRONG_CREDENTIAL"
	}
})
	.then(r => {
		if (r.status === 200) {
			r.json().then(j => console.log(j));
		} else {
			console.log("ERROR", r.status);
		}
	})
	.catch(e => console.log(e));
```
