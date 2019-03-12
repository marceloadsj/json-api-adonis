const { ServiceProvider } = require("@adonisjs/fold");

const MissingConfigTypesException = require("../src/exceptions/MissingConfigTypesException");
const MissingConfigFileException = require("../src/exceptions/MissingConfigFileException");
const WrongConfigException = require("../src/exceptions/WrongConfigException");
const JsonApiService = require("../src/services/JsonApiService");
const RequestService = require("../src/services/RequestService");
const ContentNegotiationMiddleware = require("../src/middlewares/ContentNegotiationMiddleware");

const defaultConfig = {
  deserializeBody: true,
  getErrorIdFromName: true,
  getErrorCodeFromName: true,
  getErrorDetailFromMessage: true
};

class JsonApiProvider extends ServiceProvider {
  register() {
    this._registerJsonApiService();
    this._registerContentNegotiationMiddleware();
    this._registerLucidSerializer();
  }

  boot() {
    const Context = this.app.use("Adonis/Src/HttpContext");

    const config = this._getConfig(this.app);

    Context.getter(
      "jsonapi",
      function() {
        return new RequestService({ config, request: this.request });
      },
      true
    );
  }

  _getConfig(app) {
    const Env = app.use("Adonis/Src/Env");
    const Config = app.use("Adonis/Src/Config");

    if (!this.config) {
      const config = Config.get("jsonapi");

      if (Env.get("NODE_ENV") === "development") {
        if (!config) throw MissingConfigFileException.invoke();

        if (config.options && typeof config.options !== "object") {
          throw WrongConfigException.invoke("options");
        }

        if (!config.types) {
          throw MissingConfigTypesException.invoke();
        } else if (typeof config.types !== "object") {
          throw WrongConfigException.invoke("types");
        }
      }

      this.config = Config.merge("jsonapi", defaultConfig);
    }

    return this.config;
  }

  _registerJsonApiService() {
    this.app.singleton("json-api-adonis/services/JsonApiService", () => {
      const Logger = this.app.use("Adonis/Src/Logger");

      const config = this._getConfig(this.app);

      return new JsonApiService({ config, Logger });
    });

    this.app.alias("json-api-adonis/services/JsonApiService", "JsonApiService");
  }

  _registerContentNegotiationMiddleware() {
    this.app.bind(
      "json-api-adonis/middlewares/ContentNegotiationMiddleware",
      () => {
        const JsonApiService = this.app.use(
          "json-api-adonis/services/JsonApiService"
        );
        const config = this._getConfig(this.app);

        return new ContentNegotiationMiddleware({ config, JsonApiService });
      }
    );
  }

  _registerLucidSerializer() {
    this.app.bind("json-api-adonis/serializers/LucidSerializer", () =>
      require("../src/serializers/LucidSerializer")
    );
  }
}

module.exports = JsonApiProvider;
