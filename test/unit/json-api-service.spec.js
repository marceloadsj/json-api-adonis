const test = require("japa");

const JsonApiService = require("../../src/services/JsonApiService");

test.group("JsonApiService", () => {
  test("get type from model based on constructor name", assert => {
    class User {}
    const model = new User();

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.equal(jsonApiService.getTypeFromModel(model), "user");
  });

  test("throw an error if no type is found", assert => {
    class Token {}
    const model = new Token();

    const jsonApiService = new JsonApiService({ config: {} });

    assert.throw(
      () => jsonApiService.getTypeFromModel(model),
      "The type with model 'Token' was not found in json api config file"
    );
  });

  test("serialize a model passing the type", assert => {
    class User {}
    const model = new User();

    model.name = "Marcelo Junior";
    model.gender = "male";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serialize("user", model), {
      jsonapi: { version: "1.0" },
      data: {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize a model without passing the type", assert => {
    class User {}
    const model = new User();

    model.name = "Marcelo Junior";
    model.gender = "male";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeModel(model), {
      jsonapi: { version: "1.0" },
      data: {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of models passing the type", assert => {
    class User {}
    const models = [new User(), new User()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].name = "Suellen Siqueira";
    models[1].gender = "female";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serialize("user", models), {
      jsonapi: { version: "1.0" },
      data: [
        {
          id: undefined,
          type: "user",
          attributes: { name: "Marcelo Junior", gender: "male" },
          links: undefined,
          relationships: undefined
        },
        {
          id: undefined,
          type: "user",
          attributes: { name: "Suellen Siqueira", gender: "female" },
          links: undefined,
          relationships: undefined
        }
      ],
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of same models without passing the type", assert => {
    class User {}
    const models = [new User(), new User()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].name = "Suellen Siqueira";
    models[1].gender = "female";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeModels(models), {
      jsonapi: { version: "1.0" },
      data: [
        {
          id: undefined,
          type: "user",
          attributes: { name: "Marcelo Junior", gender: "male" },
          links: undefined,
          relationships: undefined
        },
        {
          id: undefined,
          type: "user",
          attributes: { name: "Suellen Siqueira", gender: "female" },
          links: undefined,
          relationships: undefined
        }
      ],
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of diff models without passing the type", assert => {
    class User {}
    class Token {}
    const models = [new User(), new Token()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].token = "mySecretToken";
    models[1].expiresIn = "10m";

    const config = {
      types: {
        user: { model: "App/Models/User" },
        token: { model: "App/Models/Token" }
      }
    };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeMixedModels(models), [
      {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      {
        id: undefined,
        type: "token",
        attributes: { token: "mySecretToken", expiresIn: "10m" },
        links: undefined,
        relationships: undefined
      }
    ]);
  });

  test("deserialize a simple model passing the type", assert => {
    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(
      jsonApiService.deserialize("user", {
        jsonapi: { version: "1.0" },
        data: null,
        included: undefined,
        links: undefined,
        meta: undefined
      }),
      {}
    );
  });

  test("serialize simple error object", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    const error = new Error("Critical Error");
    error.code = "CRITICAL_ERROR";
    error.status = 500;

    assert.deepEqual(jsonApiService.serializeError(error), {
      errors: [
        { detail: "Critical Error", code: "CRITICAL_ERROR", status: "500" }
      ]
    });
  });

  test("serialize a simple exception object", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    class AuthException extends Error {
      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exception = new AuthException();

    assert.deepEqual(jsonApiService.serializeException(exception), {
      errors: [{ title: "Something is wrong in your auth details" }]
    });
  });

  test("serialize an exception object with some configs", assert => {
    const config = {
      getErrorIdFromName: true,
      getErrorCodeFromName: true,
      getErrorDetailFromMessage: true
    };

    const jsonApiService = new JsonApiService({ config });

    class AuthException extends Error {
      constructor() {
        super();
        this.name = this.constructor.name;
      }

      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exception = new AuthException();

    assert.deepEqual(jsonApiService.serializeException(exception), {
      errors: [
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        }
      ]
    });
  });

  test("serialize a simple exceptions array", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    class AuthException extends Error {
      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exceptions = [new AuthException(), new AuthException()];

    assert.deepEqual(jsonApiService.serializeExceptions(exceptions), {
      errors: [
        { title: "Something is wrong in your auth details" },
        { title: "Something is wrong in your auth details" }
      ]
    });
  });

  test("serialize an exceptions array with some configs", assert => {
    const config = {
      getErrorIdFromName: true,
      getErrorCodeFromName: true,
      getErrorDetailFromMessage: true
    };

    const jsonApiService = new JsonApiService({ config });

    class AuthException extends Error {
      constructor() {
        super();
        this.name = this.constructor.name;
      }

      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exceptions = [new AuthException(), new AuthException()];

    assert.deepEqual(jsonApiService.serializeExceptions(exceptions), {
      errors: [
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        },
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        }
      ]
    });
  });
});
