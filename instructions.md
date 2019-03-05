# 🐙 Json Api Adonis - How to Use

**Create config/jsonapi.js file with:**

```
module.exports = {
  /* here some specific wrapper options */

  options: {
    /* the global/common options */
  },

  types: {
    /* all your supported types here, like */

    user: {
      // the model ensures you don't need to worry about passing type
      model: "App/Models/User",

      options: {
        /* the specific type/model options */
      }
    },

    token: {
      /* if don't have model, just pass the type to serializer */
    }
  }
};
```

---

**Add JsonApiProvider in start/app.js:**

```
const providers = [
    // ...
    'json-api-adonis/providers/JsonApiProvider'
]
```

---

**Add ContentNegotiationMiddleware in start/kernel.js:**

```
const globalMiddleware = [
    // ...
    'json-api-adonis/middlewares/ContentNegotiationMiddleware'
]
```

---

**Add LucidSerializer in your models:**

```
static get Serializer() {
    return 'json-api-adonis/serializers/LucidSerializer'
}
```

---

## Options:

Mostly options are based on the [json-api-serializer](https://www.npmjs.com/package/json-api-serializer) configurations.

The specific options are:

| Config          | Description                                                 | Default |
| --------------- | ----------------------------------------------------------- | ------- |
| deserializeBody | Deserialize request body when doing the content negotiation | true    |

Examples:

**deserializeBody - get some body information using request.input**:

- _true_ (default): `request.input('myKey')`
- _false_: `request.input('data.attributes.myKey')`
  &nbsp;

---

## Middlewares:

**ContentNegotiationMiddleware:** This one will do the [Content Negotiation](https://jsonapi.org/format/#content-negotiation) in all client requests, throwing errors when something is wrong. This middleware also put the right Content-Type header in responses.

---

## Services:

**JsonApiService**

You can import and use the JsonApiService with:

```
const JsonApiService = use('json-api-adonis/services/JsonApiService')
// or with alias
const JsonApiService = use('JsonApiService')
```

**RequestService**

You also have the jsonapi request helper service in controllers like:

```
async myEndpoint({ jsonapi }) {
  const meta = jsonapi.allMeta();
}
```

The request service methods are scoped in meta and attributes key like:

- **allMeta**: works like request.all();
- **onlyMeta**: works like request.only();
- **exceptMeta**: works like request.except();
- **inputMeta**: works like request.input();

- **allAttributes**: works like request.all();
- **onlyAttributes**: works like request.only();
- **exceptAttributes**: works like request.except();
- **inputAttribute**: works like request.input();
