"use strict";

const Vanilla = require("@adonisjs/lucid/src/Lucid/Serializers/Vanilla");

const JsonApiService = use("json-api-adonis/services/JsonApiService");

class LucidSerializer extends Vanilla {
  constructor(rows, pages, isOne) {
    super(rows, pages, isOne);

    this._getRowJSON = this._getRowJSON.bind(this);
  }

  toJSON() {
    if (this.isOne) {
      const jsonModel = this._getRowJSON(this.rows);

      if (this.rows.$parent) return jsonModel;

      const type = JsonApiService.getTypeFromModel(this.rows);

      return JsonApiService.serialize(type, jsonModel);
    }

    const type = JsonApiService.getTypeFromModel(this.rows[0]);

    const models = this.rows.map(this._getRowJSON);

    return JsonApiService.serialize(type, models);
  }
}

module.exports = LucidSerializer;
