"use strict";

const Vanilla = require("@adonisjs/lucid/src/Lucid/Serializers/Vanilla");

const JsonApiService = use("json-api-adonis/services/JsonApiService");

class LucidSerializer extends Vanilla {
  constructor(rows, pages, isOne) {
    super(rows, pages, isOne);

    this._getRowJSON.bind(this);
  }

  toJSON() {
    if (this.isOne) {
      const type = JsonApiService.getTypeFromModel(this.rows);

      const data = this._getRowJSON(this.rows);

      return JsonApiService.serialize(type, data);
    }

    const type = JsonApi.getTypeFromModel(this.rows[0]);

    const data = this.rows.map(this._getRowJSON);

    return JsonApi.serialize(type, data);
  }
}

module.exports = LucidSerializer;
