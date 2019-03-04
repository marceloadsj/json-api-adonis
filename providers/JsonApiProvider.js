const { ServiceProvider } = require("@adonisjs/fold");

const defaultConfig = {
  deserializeBody: true
};

class JsonApiProvider extends ServiceProvider {
  _registerJsonApiService() {
    this.app.singleton("json-api-adonis/services/JsonApiService", () => {
      const Logger = this.app.use("Adonis/Src/Logger");
      const Config = this.app.use("Adonis/Src/Config");
      const JsonApiService = require("../src/services/JsonApiService");

      return new JsonApiService({ Config, Logger });
    });

    this.app.alias("json-api-adonis/services/JsonApiService", "JsonApiService");
  }

  _registerRequestService() {
    this.app.bind("json-api-adonis/services/RequestService", () => {
      return require("../src/services/RequestService");
    });
  }

  _registerServices() {
    this._registerJsonApiService();
    this._registerRequestService();
  }

  _registerMiddlewares() {
    this.app.bind("json-api-adonis/middlewares/JsonApiMiddleware", () => {
      const Config = this.app.use("Adonis/Src/Config");
      const JsonApiMiddleware = require("../src/middlewares/JsonApiMiddleware");

      return new JsonApiMiddleware({ Config });
    });
  }

  _registerSerializers() {
    this.app.bind("json-api-adonis/serializers/JsonApiSerializer", () =>
      require("../src/serializers/JsonApiSerializer")
    );
  }

  register() {
    this._registerServices();
    this._registerMiddlewares();
    this._registerSerializers();
  }

  boot() {
    const Config = this.app.use("Adonis/Src/Config");
    Config.merge("jsonapi", defaultConfig);

    const Context = this.app.use("Adonis/Src/HttpContext");
    const RequestService = this.app.use(
      "json-api-adonis/services/RequestService"
    );
    const Config = this.app.use("Adonis/Src/Config");

    Context.getter(
      "jsonapi",
      function() {
        return new RequestService({ Config, request: this.request });
      },
      true
    );
  }
}

module.exports = JsonApiProvider;
