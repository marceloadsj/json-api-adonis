"use strict";

const JsonApiSerializer = require("json-api-serializer");

const MissingConfigFileException = require("../exceptions/MissingConfigFileException");
const TypeNotFoundException = require("../exceptions/TypeNotFoundException");

class JsonApiService {
  constructor({ Config, Logger }) {
    this.Logger = Logger;

    this.config = Config.get("jsonapi");

    if (!this.config) {
      throw MissingConfigFileException.invoke();
    }

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
        if (this.config.types[key].model.endsWith(name)) {
          type = key;
          return true;
        }

        return false;
      });
    }

    if (!type) throw TypeNotFoundException.invoke(name);

    return type;
  }

  serialize(type, data) {
    return this.jsonApiSerializer.serialize(type, data);
  }

  serializeError(error) {
    return this.jsonApiSerializer.serializeError(error);
  }

  deserialize(type, data) {
    return this.jsonApiSerializer.deserialize(type, data);
  }
}

module.exports = JsonApiService;
