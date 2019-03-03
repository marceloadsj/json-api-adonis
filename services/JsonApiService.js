"use strict";

const JsonApiSerializer = require("json-api-serializer");

class JsonApiService {
  constructor({ Config, Logger }) {
    this.Logger = Logger;

    this.config = Config.get("jsonapi");

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
    } else {
      this.Logger.warning(`The type ${name} was not found`);
      return;
    }

    return type;
  }

  serialize(type, data) {
    return this.jsonApiSerializer.serialize(type, data);
  }

  serializeError(error) {
    return this.jsonApiSerializer.serializeError(error);
  }
}

module.exports = JsonApiService;
