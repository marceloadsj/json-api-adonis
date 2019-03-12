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

    return this.jsonApiSerializer.serialize(
      type,
      model.toJSON ? model.toJSON() : model
    );
  }

  serializeModels(models) {
    return this.jsonApiSerializer.serialize(
      { type: model => this.getTypeFromModel(model) },
      models.toJSON ? models.toJSON() : models
    );
  }

  serializeMixedModels(models) {
    return this.jsonApiSerializer.serializeMixedData(
      { type: model => this.getTypeFromModel(model) },
      models.toJSON ? models.toJSON() : models
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

  _injectAndGetSelect(query, { fields, types, type }) {
    if (fields) {
      return Object.keys(fields).reduce((includeFields, key) => {
        const config = types[key];

        if (config) {
          let id = "id";
          if (config.options && config.options.id) id = config.options.id;

          let parsedFields = `${id},${fields[key]}`
            .split(",")
            .map(field => field.trim())
            .filter(field => field);

          if (key === type) {
            if (config.options && config.options.relationships) {
              parsedFields = parsedFields.concat(
                Object.keys(config.options.relationships).map(key => {
                  const relationship = config.options.relationships[key];
                  return relationship.alternativeKey || key;
                })
              );
            }

            query.select(parsedFields);
          } else {
            includeFields[key] = parsedFields;
          }
        }

        return includeFields;
      }, {});
    }
  }

  _injectWith(query, { model, includeFields, hasSelect, include, config }) {
    if (include) {
      include.split(",").forEach(include => {
        const relationship = model[include]();

        if (hasSelect && relationship.constructor.name === "BelongsTo") {
          query.select(relationship.primaryKey);
        }

        let key;
        if (
          config &&
          config.options &&
          config.options.relationships &&
          config.options.relationships[include]
        ) {
          key = config.options.relationships[include].type;
        }

        if (key && includeFields && includeFields[key]) {
          query.with(include, query => query.select(includeFields[key]));
        } else {
          query.with(include);
        }
      });
    }
  }

  _injectSort(query, { sort }) {
    if (sort) {
      sort.split(",").forEach(sort => {
        if (sort.startsWith("-")) {
          query.orderBy(sort.replace("-", ""), "desc");
        } else {
          query.orderBy(sort, "asc");
        }
      });
    }
  }

  query(Model, { fields, include, sort }) {
    const model = new Model();

    const type = this.getTypeFromModel(model);
    const { types } = this.config;

    const query = Model.query();

    const includeFields = this._injectAndGetSelect(query, {
      fields,
      types,
      type
    });

    const hasSelect = Boolean(fields && fields[type]);

    const config = types[type];

    this._injectWith(query, {
      model,
      includeFields,
      hasSelect,
      include,
      config
    });

    this._injectSort(query, { sort });

    return query;
  }
}

module.exports = JsonApiService;
