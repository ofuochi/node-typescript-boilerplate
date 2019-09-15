# Enterprise NodeJs/Typescript API boilerplate

## Running the app

> NOTE: These instructions require [MongoDB](https://docs.mongodb.com/manual/installation/) and [Node.js](https://nodejs.org/en/download/) to be installed on your environment.

Clone the repository:

```sh
git clonehttps://github.com/ofuochi/node-typescript-boilerplate.git
```

Copy the sample env file into a .env file:

```sh
cp env.sample .env
```

Install dependencies:

```sh
npm i
```

Run the tests:

```sh
npm run test
```

Run the app:

```sh
npm run start
```

Open:

```sh
open http://localhost:3000/api/movies
```

## REST Services

The application exposes a few REST endpoints:

-   HTTP GET `/api/actors`
-   HTTP GET `/api/actors:id`
-   HTTP GET `/api/directors`
-   HTTP GET `/api/directors/:id`
-   HTTP GET `/api/movies`
-   HTTP GET `/api/movies/:id`
-   HTTP GET `/api/search/:query`
-   HTTP GET `/api/secured` (Requires a valid `x-auth-token` header)

You can use the following code snippet to call the secured endpoint:

```js
fetch("http://localhost:3000/api/secure", {
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
fetch("http://localhost:3000/api/secure", {
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
