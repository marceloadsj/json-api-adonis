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

| Config               | Description                                                                             | Default |
| -------------------- | --------------------------------------------------------------------------------------- | ------- |
| deserializeBody      | Deserialize request body when doing the content negotiation                             | true    |
| getErrorIdFromName   | Generate error id from name when using serializeException                               | true    |
| getErrorCodeFromName | Generate code from name when using serializeException, this is always UPPER_SNAKE_CASED | true    |
| deserializeBody      | Use message as detail field in error when using serializeException                      | true    |

Some examples:

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

- **query(Model, request.get()):query**: pass down the Model and the request query params and get a query to fetch the data;

This function accepts { fields, include, sort } query params, following the jsonapi specification!

- **getTypeFromModel(lucidModelInstance):string** : pass a lucid model instance and get the type string;
- **serializeException(exception):object**: pass an error object to get the json api version of it;
- **serializeExceptions(exception):object**: pass an array of error objects to get the json api version of it;

_Please, just use the next functions if you are not using the JsonApiSerializer in the model, otherwise use model.toJSON()!_

- **serializeModel(lucidModelInstance):object** : pass a lucid model instance and get the serialized version;
- **serializeModels(lucidModelInstances):object** : pass an array of **same** lucid models instances and get the serialized version;
- **serializeModels(lucidModelInstances):object** : pass an array of **different** lucid models instances and get the serialized version;

### Tip about Exceptions:

You can use the **serializeException(s)** function(s) in your [Global Handler](https://adonisjs.com/docs/4.1/exceptions#_wildcard_handler) to parse all errors using the jsonapi specification.
Then, your [custom exceptions](https://adonisjs.com/docs/4.1/exceptions#_custom_exceptions) can have different methods to match the specification like:

```
class CustomException extends LogicalException {
  getId() {
    return "MyErrorId"; // take a look at getErrorIdFromName config too
  }

  getLinks() {
    return { about: "https://example.com/helpcenter/errors" };
  }

  getStatus() {
    return 404; // you need to grab the status and send like response.status(error.status).send(...)
  }

  getCode() {
    return "MY_ERROR_CODE"; // take a look at getErrorCodeFromName config too
  }

  getTitle() {
    return "There's an error with the request";
  }

  getDetail() {
    return "This is the description of the error"; // take a look at getErrorDetailFromMessage config too
  }

  getSource() {
    return { /* my source props */ };
  }

  getMeta() {
    return { /* my meta props */ };
  }
}
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
- **onlyMeta**: works like request.only() or request.collect();
- **exceptMeta**: works like request.except() or request.collect();
- **inputMeta**: works like request.input() or request.collect();

- **allAttributes**: works like request.all();
- **onlyAttributes**: works like request.only() or request.collect();
- **exceptAttributes**: works like request.except() or request.collect();
- **inputAttribute**: works like request.input() or request.collect();

All methods works with serialized or deserialized body, and with single or multiple resources body.
