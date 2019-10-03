# NodeJs/Typescript API Boilerplate
### For Enterprise

## Running the app

> **NOTE**: These instructions require [MongoDB](https://docs.mongodb.com/manual/installation/) and [Node.js](https://nodejs.org/en/download/) to be installed on your environment.

### Clone the Repository:

```sh
git clone https://github.com/ofuochi/node-typescript-boilerplate.git
cd node-typescript-boilerplate
```

### Create Your Branch

```sh
git checkout -b <INSERT-BRANCH-NAME>
```

### Install Dependencies:

```sh
npm install
```

### Run the App:

```sh
npm run start
```

### Copy Files
#### Sample `env` File into a `.env` File:

```sh
cp env.sample .env
```

### Run Tests:

```sh
npm run test
```

### Open:

```sh
open http://localhost:3000/api/v1/tenants
```

## REST Services

The application exposes a few REST endpoints:

-   `HTTP` `GET` `/api/v1/users`
-   `HTTP` `GET` `/api/v1/users/:id`
-   `HTTP` `GET` `/api/v1/tenats/:query`
-   `HTTP` `GET` `/api/v1/secured` (Requires a valid `x-auth-token` header)

You can use the following code snippet to call the secured endpoint:

```js
fetch("http://localhost:3000/api/v1/secure", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
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
