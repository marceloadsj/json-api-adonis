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

  serialize(type, model) {
    return this.jsonApiSerializer.serialize(type, model);
  }

  serializeModel(model) {
    const type = this.getTypeFromModel(model);

    return this.jsonApiSerializer.serialize(type, model);
  }

  serializeError(error) {
    return this.jsonApiSerializer.serializeError(error);
  }

  deserialize(type, model) {
    return this.jsonApiSerializer.deserialize(type, model);
  }
}

module.exports = JsonApiService;
