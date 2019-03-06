"use strict";

const JsonApiSerializer = require("json-api-serializer");

const TypeNotFoundException = require("../exceptions/TypeNotFoundException");

class JsonApiService {
  constructor({ config, Logger }) {
    this.Logger = Logger;
    this.config = config;

    this.jsonApiSerializer = new JsonApiSerializer(this.config.options);

    if (this.config.types) {
      Object.keys(this.config.types).forEach(key => {
        this.jsonApiSerializer.register(key, this.config.types[key].options);
      });
    }

    this.serialize = this.jsonApiSerializer.serialize.bind(
      this.jsonApiSerializer
    );

    this.deserialize = this.jsonApiSerializer.deserialize.bind(
      this.jsonApiSerializer
    );

    this.serializeError = this.jsonApiSerializer.serializeError.bind(
      this.jsonApiSerializer
    );
  }

  getTypeFromModel(model) {
    let type;

    const name = model.constructor.name;

    if (this.config.types) {
      Object.keys(this.config.types).forEach(key => {
        if (this.config.types[key].model.endsWith(`/${name}`)) {
          type = key;
          return true;
        }

        return false;
      });
    }

    if (!type) throw TypeNotFoundException.invoke(name);

    return type;
  }

  serializeModel(model) {
    const type = this.getTypeFromModel(model);

    return this.jsonApiSerializer.serialize(type, model);
  }

  serializeModels(models) {
    return this.jsonApiSerializer.serialize(
      { type: model => this.getTypeFromModel(model) },
      models
    );
  }

  serializeMixedModels(models) {
    return this.jsonApiSerializer.serializeMixedData(
      { type: model => this.getTypeFromModel(model) },
      models
    );
  }

  _parseException(error) {
    const exception = {};

    if (typeof error.getId === "function") {
      exception.id = error.getId();
    } else if (this.config.getErrorIdFromName && error.name) {
      exception.id = error.name;
    }

    if (typeof error.getLinks === "function") {
      exception.links = error.getLinks();
    }

    if (typeof error.getStatus === "function") {
      exception.status = error.getStatus();
    }

    if (typeof error.getCode === "function") {
      exception.code = error.getCode();
    } else if (this.config.getErrorCodeFromName && error.name) {
      exception.code = error.name
        .split(/(?=[A-Z])/)
        .join("_")
        .toUpperCase();
    }

    if (typeof error.getTitle === "function") {
      exception.title = error.getTitle();
    }

    if (typeof error.getDetail === "function") {
      exception.detail = error.getDetail();
    } else if (this.config.getErrorDetailFromMessage && error.message) {
      exception.detail = error.message;
    }

    if (typeof error.getSource === "function") {
      exception.source = error.getSource();
    }

    if (typeof error.getMeta === "function") {
      exception.meta = error.getMeta();
    }

    return exception;
  }

  serializeException(error) {
    const exception = this._parseException(error);

    return this.jsonApiSerializer.serializeError(exception);
  }

  serializeExceptions(errors) {
    const exceptions = errors.map(error => this._parseException(error));

    return this.jsonApiSerializer.serializeError(exceptions);
  }
}

module.exports = JsonApiService;
