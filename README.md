# HydraDev Pilot Project Backend

## Development

The first time, you will need to run

```
npm install
```

Then just start the server with

```
npm run start
```

# API Validation

By using celebrate the req.body schema becomes clary defined at route level, so even frontend devs can read what an API endpoint expects without need to writting a documentation that can get outdated quickly.

```js
route.post(
  '/signup',
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  controller.signup,
);
```

**Example error**

```json
{
  "errors": {
    "message": "child \"email\" fails because [\"email\" is required]"
  }
}
```

## Credits

- Boilerplate used: https://github.com/santiq/bulletproof-nodejs
