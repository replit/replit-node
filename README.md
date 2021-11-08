# replit-node

A node.js library that helps you build excellent things inside Repls!

## Features

### Auth Middleware

The auth middleware allows for simple use of
[Replit Auth](https://docs.replit.com/hosting/authenticating-users-repl-auth) by
creating a `req.auth` object with the user's `id`, `name`, and `roles`. When the user
is not signed in, `req.auth` is `undefined`.

You can activate the middleware for you entire app like this:

```js
const replit = require("PKG_NAME_TBD");
const express = require("express");

const app = express();
app.use(replit.authMiddleware);
```

You can then use the `req.auth` object in your routes:

```js
app.get("/", (req, res) => {
  // for demo purposes. it's shorter to use `requireAuth` instead of this.
  if (req.auth) {
    res.end(`Hello, ${req.auth.name}`);
  } else {
    res.send(`Sign in with Repl Auth to use this demo: ${replit.AUTH_SNIPPET}`);
  }
});
```

### requireAuth Middleware

The `requireAuth` middleware simplifies showing a login screen whenever the user isn't
signed in with Replit auth. By default, it returns the `AUTH_SNIPPET` whenever the user
isn't signed in. For example:

```js
app.get("/", replit.requireAuth(), (req, res) =>
  res.end(`Hello, ${req.auth.name}`)
);
```

You can also customize the login response:

```js
app.get(
  "/",
  replit.requireAuth(
    `Sign in with Repl Auth to use this demo: ${replit.AUTH_SNIPPET}`
  ),
  (req, res) => res.end(`Hello, ${req.auth.name}`)
);
```

#### Note about AUTH_SNIPPET

The auth snippet includes some JavaScript that generates a button that users can click
to sign in to your app with Replit auth. Once they are signed in, it will reload the
page. This means that using it will only work on pages where the user is directly
visiting user their browser and a GET request. It won't work with API routes. In
certain cases, it may make more sense to redirect users to a dedicated login page
instead. You can access the auth snippet by including `replit.AUTH_SNIPPET` in an HTML
response (`res.send()`).

### Database Client

For bare-metal performance, use the `RawClient`. It is nothing but a node interface to
the database API without any transformations or niceties. You can use it like this:

```js
const { RawClient } = require("PKG_NAME_TBD");
const db = new RawCLient(process.env.REPLIT_DB_URL);
```

You can then call the `db.list`, `db.get`, `db.setMany`, and `db.delete` functions.
