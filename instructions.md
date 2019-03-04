# 🐙 Json Api Adonis - How to Use

&nbsp;
**Create config/jsonapi.js file with:**

```
module.exports = {
  /* here some specific wrapper options */

  options: { /* the global/common options */ },

  types: {
    /* all your supported types here, like */
    user: {
      model: "App/Models/User",
      options: { /* the specific type/model options */ }
    }
  }
};
```

&nbsp;
**Add json api service provider in start/app.js:**

```
const providers = [
    // ...
    'json-api-adonis/providers/JsonApiProvider'
]
```

&nbsp;
**Add json api global middleware:**

```
const globalMiddleware = [
    // ...
    'json-api-adonis/middlewares/JsonApiMiddleware'
]
```

&nbsp;
**Add json api serializer in your models:**

```
static get Serializer() {
    return 'json-api-adonis/serializers/JsonApiSerializer'
}
```

&nbsp;

---

## Options:

Mostly options are based on the [json-api-serializer](https://www.npmjs.com/package/json-api-serializer) configurations.

The specific options are:

| Config          | Description                                                 | Default |
| --------------- | ----------------------------------------------------------- | ------- |
| deserializeBody | Deserialize request body when doing the content negotiation | true    |

Examples:
**deserializeBody**:

- _true_ (default): `request.input('myKey')`
- _false_: `request.input('data.attributes.myKey')`
  &nbsp;

---

## Middlewares:

**Global JsonApiMiddleware**
The global middleware will do the [Content Negotiation](https://jsonapi.org/format/#content-negotiation) in all client requests, throwing errors when something is wrong. This middleware also put the right Content-Type header in responses.

---

## Services:

You can import and use the JsonApiService with:

`const JsonApiService = use('json-api-adonis/services/JsonApiService')`

or the alias

`const JsonApiService = use('JsonApiService')`

You also have the jsonapi request helper in controllers like:

```
async myEndpoint({ jsonapi }) {
  const meta = jsonapi.allMeta();
}
```

The methods are scoped in meta and attributes key:

- **allMeta**: works like request.all();
- **onlyMeta**: works like request.only();
- **exceptMeta**: works like request.except();
- **inputMeta**: works like request.input();

- **allAttributes**: works like request.all();
- **onlyAttributes**: works like request.only();
- **exceptAttributes**: works like request.except();
- **inputAttribute**: works like request.input();
