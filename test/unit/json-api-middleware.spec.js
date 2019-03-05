const test = require("japa");
const { Config } = require("@adonisjs/sink");
const { ioc } = require("@adonisjs/fold");

ioc.bind("JsonApiService", () => require("../src/services/JsonApiService"));

const JsonApiMiddleware = require("../src/middlewares/JsonApiMiddleware");

test.group("JsonApiMiddleware", () => {
  test("throw exception when config file is missing", assert => {
    const jsonApiMiddleware = () => {
      return new JsonApiMiddleware({ Config: new Config() });
    };

    assert.throw(jsonApiMiddleware, "The 'config/jsonapi.js' file is missing");
  });

  test("load correctly config from config file", assert => {
    const config = new Config();
    config.set("jsonapi", { someKey: "someValue" });

    const jsonApiMiddleware = new JsonApiMiddleware({ Config: config });

    assert.deepEqual(jsonApiMiddleware.config, { someKey: "someValue" });
  });
});
