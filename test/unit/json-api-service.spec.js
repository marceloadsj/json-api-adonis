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

  test("serialize a simple model passing the type", assert => {
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

  test("serialize a simple model without type", assert => {
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
});
