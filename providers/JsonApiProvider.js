const { ServiceProvider } = require("@adonisjs/fold");

class JsonApiProvider extends ServiceProvider {
  register() {
    this.app.singleton("adonis-json-api/services/JsonApiService", () => {
      const Logger = this.app.use("Adonis/Src/Logger");
      const Config = this.app.use("Adonis/Src/Config");

      const JsonApiService = require("../services/JsonApiService");

      return new JsonApiService({ Config, Logger });
    });

    this.app.alias("adonis-json-api/services/JsonApiService", "JsonApiService");

    this.app.bind("adonis-json-api/middlewares/JsonApiMiddleware", () => {
      const JsonApiMiddleware = require("../middlewares/JsonApiMiddleware");
      return new JsonApiMiddleware();
    });

    this.app.bind("adonis-json-api/serializers/JsonApiSerializer", () =>
      require("../serializers/JsonApiSerializer")
    );
  }
}

module.exports = JsonApiProvider;
