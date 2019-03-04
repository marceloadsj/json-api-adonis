const test = require("japa");
const { Config } = require("@adonisjs/sink");

const JsonApiService = require("../src/services/JsonApiService");

test.group("JsonApiService", () => {
  test("throw exception when config file is missing", assert => {
    const jsonApiService = () => new JsonApiService({ Config: new Config() });
    assert.throw(jsonApiService, "The 'config/jsonapi.js' file is missing");
  });

  test("load correctly config from config file", assert => {
    const config = new Config();
    config.set("jsonapi", { someKey: "someValue" });

    const jsonApiService = new JsonApiService({ Config: config });
    assert.deepEqual(jsonApiService.config, { someKey: "someValue" });
  });

  test("get type from model based on constructor name", assert => {
    const config = new Config();
    config.set("jsonapi", {
      types: {
        user: { model: "App/Models/User" }
      }
    });

    const jsonApiService = new JsonApiService({ Config: config });

    class User {}
    const model = new User();

    assert.equal(jsonApiService.getTypeFromModel(model), "user");
  });

  test("throw an error if no type is found", assert => {
    const config = new Config();
    config.set("jsonapi", {
      types: {
        user: { model: "App/Models/User" }
      }
    });

    const jsonApiService = new JsonApiService({ Config: config });

    class Token {}
    const model = new Token();

    assert.throw(
      () => jsonApiService.getTypeFromModel(model),
      "The type 'Token' was not found in config file"
    );
  });

  test("serialize a simple model", assert => {
    const config = new Config();
    config.set("jsonapi", {
      types: {
        user: { model: "App/Models/User" }
      }
    });

    const jsonApiService = new JsonApiService({ Config: config });

    class User {}
    const model = new User();

    assert.deepEqual(jsonApiService.serialize("user", model), {
      jsonapi: { version: "1.0" },
      data: null,
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("deserialize a simple model", assert => {
    const config = new Config();
    config.set("jsonapi", {
      types: {
        user: { model: "App/Models/User" }
      }
    });

    const jsonApiService = new JsonApiService({ Config: config });

    class User {}
    const model = new User();

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
    const config = new Config();
    config.set("jsonapi", {});

    const jsonApiService = new JsonApiService({ Config: config });

    assert.deepEqual(jsonApiService.serializeError(new Error("Some Value")), {
      errors: [{ detail: "Some Value", code: undefined, status: undefined }]
    });
  });
});
