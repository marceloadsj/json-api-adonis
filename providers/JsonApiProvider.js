const { ServiceProvider } = require("@adonisjs/fold");

class JsonApiProvider extends ServiceProvider {
  _registerJsonApiService() {
    this.app.singleton("adonis-json-api/services/JsonApiService", () => {
      const Logger = this.app.use("Adonis/Src/Logger");
      const Config = this.app.use("Adonis/Src/Config");
      const JsonApiService = require("../src/services/JsonApiService");

      return new JsonApiService({ Config, Logger });
    });

    this.app.alias("adonis-json-api/services/JsonApiService", "JsonApiService");
  }

  _registerRequestService() {
    this.app.bind("adonis-json-api/services/RequestService", () => {
      return require("../src/services/RequestService");
    });
  }

  _registerServices() {
    this._registerJsonApiService();
    this._registerRequestService();
  }

  _registerMiddlewares() {
    this.app.bind("adonis-json-api/middlewares/JsonApiMiddleware", () => {
      const Config = this.app.use("Adonis/Src/Config");
      const JsonApiMiddleware = require("../src/middlewares/JsonApiMiddleware");

      return new JsonApiMiddleware({ Config });
    });
  }

  _registerSerializers() {
    this.app.bind("adonis-json-api/serializers/JsonApiSerializer", () =>
      require("../src/serializers/JsonApiSerializer")
    );
  }

  register() {
    this._registerServices();
    this._registerMiddlewares();
    this._registerSerializers();
  }

  boot() {
    const Context = this.app.use("Adonis/Src/HttpContext");
    const RequestService = this.app.use(
      "adonis-json-api/services/RequestService"
    );
    const Config = this.app.use("Adonis/Src/Config");

    Context.getter(
      "jsonapi",
      () => new RequestService({ Config, request: this.request }),
      true
    );
  }
}

module.exports = JsonApiProvider;
