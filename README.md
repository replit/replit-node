# replit-node

A node.js library that helps you build excellent things inside Repls!

## Express middlewares

### Auth Middleware

The auth middleware allows for simple use of
[Replit Auth](https://docs.replit.com/hosting/authenticating-users-repl-auth) by
creating a `req.auth` object with the user's `id`, `name`, and `roles`. When the user
is not signed in, `req.auth` is `undefined`.

You can activate the middleware for you entire app like this:

```js
const replit = require("./dist/index");
const express = require("express");

const app = express();
app.use(replit.authMiddleware);
```

You can then use the `req.auth` object in your routes:

```js
app.get("/", (req, res) => {
  if (req.auth) {
    res.end(`Hello, ${req.auth.name}`);
  } else {
    res.send(
      `Sign in with Repl Auth to use this demo: ${replit.SIGNIN_SNIPPET}`
    );
  }
});
```
