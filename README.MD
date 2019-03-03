# 🐙 Adonis Json Api

Wrapper between [json-api-serializer](https://www.npmjs.com/package/json-api-serializer) and [Adonis](https://adonisjs.com/)!

---

## How to use

**Install:**
`yarn add marceloadsj/adonis-json-api`

_I will soon publish it to npm_

**Create config/jsonapi.js file with:**

```
module.exports = {
  options: { /* the global/common options */ },
  types: {
    [typeName]: {
      model: 'App/Models/[ModelName]',
      options: { /* the specific type/model options */ }
    }
  }
}
```

**Add service provider in start/app.js:**

```
const providers = [
    // ...
    'adonis-json-api/providers/JsonApiProvider'
]
```

**Add global middleware:**

```
const globalMiddleware = [
    // ...
    'adonis-json-api/middlewares/JsonApiMiddleware'
]
```

**Add serializer in your models:**

```
static get Serializer() {
    return 'adonis-json-api/serializers/JsonApiSerializer'
}
```

---

## Options:

All the options are based on the [json-api-serializer](https://www.npmjs.com/package/json-api-serializer) configurations.

---

### Middleware:

The middleware will do the [Content Negotiation](https://jsonapi.org/format/#content-negotiation) in all client requests, throwing errors when something is wrong.

---

### Service:

You can import and use the Service with:

`const JsonApiService = use('adonis-json-api/services/JsonApiService')`
or the alias
`const JsonApiService = use('JsonApiService')`

The service has some helper methods you can use like:

| Method | Params | Description |
| ------ | ------ | ----------- |

