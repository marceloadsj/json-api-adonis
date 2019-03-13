const path = require("path");
const test = require("japa");
const { Config } = require("@adonisjs/sink");
const DatabaseManager = require("@adonisjs/lucid/src/Database/Manager");
const iocResolver = require("@adonisjs/lucid/lib/iocResolver");
const fold = require("@adonisjs/fold");

iocResolver.setFold(fold);

const Model = require("@adonisjs/lucid/src/Lucid/Model");

const JsonApiService = require("../../src/services/JsonApiService");

test.group("JsonApiService", () => {
  test("get type from model based on constructor name", assert => {
    class User {}
    const model = new User();

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.equal(jsonApiService.getTypeFromModel(model), "user");
  });

  test("throw an error if no type is found", assert => {
    class Token {}
    const model = new Token();

    const jsonApiService = new JsonApiService({ config: {} });

    assert.throw(
      () => jsonApiService.getTypeFromModel(model),
      "The type with model 'Token' was not found in json api config file"
    );
  });

  test("serialize a model passing the type", assert => {
    class User {}
    const model = new User();

    model.name = "Marcelo Junior";
    model.gender = "male";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serialize("user", model), {
      jsonapi: { version: "1.0" },
      data: {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize a model without passing the type", assert => {
    class User {}
    const model = new User();

    model.name = "Marcelo Junior";
    model.gender = "male";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeModel(model), {
      jsonapi: { version: "1.0" },
      data: {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of models passing the type", assert => {
    class User {}
    const models = [new User(), new User()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].name = "Suellen Siqueira";
    models[1].gender = "female";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serialize("user", models), {
      jsonapi: { version: "1.0" },
      data: [
        {
          id: undefined,
          type: "user",
          attributes: { name: "Marcelo Junior", gender: "male" },
          links: undefined,
          relationships: undefined
        },
        {
          id: undefined,
          type: "user",
          attributes: { name: "Suellen Siqueira", gender: "female" },
          links: undefined,
          relationships: undefined
        }
      ],
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of same models without passing the type", assert => {
    class User {}
    const models = [new User(), new User()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].name = "Suellen Siqueira";
    models[1].gender = "female";

    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeModels(models), {
      jsonapi: { version: "1.0" },
      data: [
        {
          id: undefined,
          type: "user",
          attributes: { name: "Marcelo Junior", gender: "male" },
          links: undefined,
          relationships: undefined
        },
        {
          id: undefined,
          type: "user",
          attributes: { name: "Suellen Siqueira", gender: "female" },
          links: undefined,
          relationships: undefined
        }
      ],
      included: undefined,
      links: undefined,
      meta: undefined
    });
  });

  test("serialize an array of diff models without passing the type", assert => {
    class User {}
    class Token {}
    const models = [new User(), new Token()];

    models[0].name = "Marcelo Junior";
    models[0].gender = "male";

    models[1].token = "mySecretToken";
    models[1].expiresIn = "10m";

    const config = {
      types: {
        user: { model: "App/Models/User" },
        token: { model: "App/Models/Token" }
      }
    };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(jsonApiService.serializeMixedModels(models), [
      {
        id: undefined,
        type: "user",
        attributes: { name: "Marcelo Junior", gender: "male" },
        links: undefined,
        relationships: undefined
      },
      {
        id: undefined,
        type: "token",
        attributes: { token: "mySecretToken", expiresIn: "10m" },
        links: undefined,
        relationships: undefined
      }
    ]);
  });

  test("deserialize a simple model passing the type", assert => {
    const config = { types: { user: { model: "App/Models/User" } } };

    const jsonApiService = new JsonApiService({ config });

    assert.deepEqual(
      jsonApiService.deserialize("user", {
        jsonapi: { version: "1.0" },
        data: null,
        included: undefined,
        links: undefined,
        meta: undefined
      }),
      {}
    );
  });

  test("serialize simple error object", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    const error = new Error("Critical Error");
    error.code = "CRITICAL_ERROR";
    error.status = 500;

    assert.deepEqual(jsonApiService.serializeError(error), {
      errors: [
        { detail: "Critical Error", code: "CRITICAL_ERROR", status: "500" }
      ]
    });
  });

  test("serialize a simple exception object", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    class AuthException extends Error {
      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exception = new AuthException();

    assert.deepEqual(jsonApiService.serializeException(exception), {
      errors: [{ title: "Something is wrong in your auth details" }]
    });
  });

  test("serialize an exception object with some configs", assert => {
    const config = {
      getErrorIdFromName: true,
      getErrorCodeFromName: true,
      getErrorDetailFromMessage: true
    };

    const jsonApiService = new JsonApiService({ config });

    class AuthException extends Error {
      constructor() {
        super();
        this.name = this.constructor.name;
      }

      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exception = new AuthException();

    assert.deepEqual(jsonApiService.serializeException(exception), {
      errors: [
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        }
      ]
    });
  });

  test("serialize a simple exceptions array", assert => {
    const jsonApiService = new JsonApiService({ config: {} });

    class AuthException extends Error {
      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exceptions = [new AuthException(), new AuthException()];

    assert.deepEqual(jsonApiService.serializeExceptions(exceptions), {
      errors: [
        { title: "Something is wrong in your auth details" },
        { title: "Something is wrong in your auth details" }
      ]
    });
  });

  test("serialize an exceptions array with some configs", assert => {
    const config = {
      getErrorIdFromName: true,
      getErrorCodeFromName: true,
      getErrorDetailFromMessage: true
    };

    const jsonApiService = new JsonApiService({ config });

    class AuthException extends Error {
      constructor() {
        super();
        this.name = this.constructor.name;
      }

      getTitle() {
        return "Something is wrong in your auth details";
      }
    }

    const exceptions = [new AuthException(), new AuthException()];

    assert.deepEqual(jsonApiService.serializeExceptions(exceptions), {
      errors: [
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        },
        {
          id: "AuthException",
          code: "AUTH_EXCEPTION",
          title: "Something is wrong in your auth details"
        }
      ]
    });
  });
});

test.group("JsonApiService async", group => {
  group.before(async () => {
    fold.ioc.bind("Adonis/Src/Database", () => {
      const config = new Config();

      config.set("database", {
        connection: "testing",
        testing: {
          client: "sqlite",
          connection: {
            filename: path.join(__dirname, "test.sqlite3")
          }
        }
      });

      return new DatabaseManager(config);
    });

    const Database = fold.ioc.use("Adonis/Src/Database");

    await Promise.all([
      Database.schema.createTable("users", table => {
        table.increments();
        table.string("name");
        table.string("email");
        table.string("password");
        table.boolean("is_active");
        table.timestamps();
      }),

      Database.schema.createTable("tokens", table => {
        table.increments();
        table
          .integer("user_id")
          .unsigned()
          .references("id")
          .inTable("users");
        table.string("token");
        table.string("type");
        table.boolean("is_revoked");
        table.timestamps();
      })
    ]);

    await Database.table("users").insert({ name: "marcelo" });
    await Database.table("tokens").insert({ user_id: 1 });
  });

  group
    .after(async () => {
      const Database = fold.ioc.use("Adonis/Src/Database");
      await Promise.all([
        Database.schema.dropTable("users"),
        Database.schema.dropTable("tokens")
      ]);
      Database.close();
    })
    .timeout(0);

  test("create simple query without request params", async assert => {
    const config = {
      types: { user: { model: "App/Models/User" } }
    };

    const jsonApiService = new JsonApiService({ config });

    class User extends Model {}
    User._bootIfNotBooted();

    let jsonApiQuery;
    User.onQuery(query => {
      jsonApiQuery = query;
    });

    await jsonApiService.query(User, {}).first();

    assert.equal(jsonApiQuery.sql, "select * from `users` limit ?");
  });

  test("create query with fields request param", async assert => {
    const config = {
      types: { user: { model: "App/Models/User" } }
    };

    const jsonApiService = new JsonApiService({ config });

    class User extends Model {}
    User._bootIfNotBooted();

    let jsonApiQuery;
    User.onQuery(query => {
      jsonApiQuery = query;
    });

    const fields = { user: "name,email" };

    await jsonApiService.query(User, { fields }).first();

    assert.equal(
      jsonApiQuery.sql,
      "select `name`, `email`, `id` from `users` limit ?"
    );
  });

  test("create query with include request param", async assert => {
    const config = {
      types: {
        tokens: {
          model: "App/Models/Token",
          options: {
            relationships: {
              user: {
                type: "users",
                alternativeKey: "user_id"
              }
            }
          }
        },
        users: {
          model: "App/Models/User"
        }
      }
    };

    const jsonApiService = new JsonApiService({ config });

    class Token extends Model {
      user() {
        return this.belongsTo(User);
      }
    }
    class User extends Model {
      tokens() {
        return this.hasMany(Token);
      }
    }
    User._bootIfNotBooted();
    Token._bootIfNotBooted();

    let userQuery;
    User.onQuery(query => {
      userQuery = query;
    });

    let tokenQuery;
    Token.onQuery(query => {
      tokenQuery = query;
    });

    const include = "tokens";

    await jsonApiService.query(User, { include }).first();

    assert.equal(userQuery.sql, "select * from `users` limit ?");
    assert.equal(
      tokenQuery.sql,
      "select * from `tokens` where `tokens`.`user_id` in (?)"
    );
  });

  test("create query with fields and include request param", async assert => {
    const config = {
      types: {
        tokens: {
          model: "App/Models/Token",
          options: {
            relationships: {
              user: {
                type: "users",
                alternativeKey: "user_id"
              }
            }
          }
        },
        users: {
          model: "App/Models/User",
          options: {
            relationships: {
              tokens: {
                type: "tokens",
                alternativeKey: "token_id"
              }
            }
          }
        }
      }
    };

    const jsonApiService = new JsonApiService({ config });

    class Token extends Model {
      user() {
        return this.belongsTo(User);
      }
    }
    class User extends Model {
      tokens() {
        return this.hasMany(Token);
      }
    }
    User._bootIfNotBooted();
    Token._bootIfNotBooted();

    let userQuery;
    User.onQuery(query => {
      userQuery = query;
    });

    let tokenQuery;
    Token.onQuery(query => {
      tokenQuery = query;
    });

    const fields = {
      users: "name",
      tokens: "id"
    };
    const include = "tokens";

    await jsonApiService.query(User, { fields, include }).first();

    assert.equal(userQuery.sql, "select `name`, `id` from `users` limit ?");
    assert.equal(
      tokenQuery.sql,
      "select `id` from `tokens` where `tokens`.`user_id` in (?)"
    );
  });

  test("create query with sort request params", async assert => {
    const config = {
      types: { user: { model: "App/Models/User" } }
    };

    const jsonApiService = new JsonApiService({ config });

    class User extends Model {}
    User._bootIfNotBooted();

    let jsonApiQuery;
    User.onQuery(query => {
      jsonApiQuery = query;
    });

    await jsonApiService.query(User, { sort: "name" }).first();

    assert.equal(
      jsonApiQuery.sql,
      "select * from `users` order by `name` asc limit ?"
    );
  });
});
