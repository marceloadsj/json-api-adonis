const http = require("http");
const test = require("japa");
const { Config } = require("@adonisjs/sink");
const Request = require("@adonisjs/framework/src/Request");
const supertest = require("supertest");

const helpers = require("./helpers");
const RequestService = require("../src/services/RequestService");

test.group("RequestService", () => {
  test("throw exception when config file is missing", assert => {
    const requestService = () => new RequestService({ Config: new Config() });
    assert.throw(requestService, "The 'config/jsonapi.js' file is missing");
  });

  test("load correctly config from config file", assert => {
    const config = new Config();
    config.set("jsonapi", { someKey: "someValue" });

    const requestService = new RequestService({ Config: config });
    assert.deepEqual(requestService.config, { someKey: "someValue" });
  });

  test("get all attributes from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({ data: { attributes: { someKey: "someValue" } } })
      .expect(200);

    assert.deepEqual(requestService.allAttributes(), { someKey: "someValue" });
  });

  test("get all attributes from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ someKey: "someValue" })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.allAttributes(), { someKey: "someValue" });
  });

  test("get all meta from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({ data: { meta: { someKey: "someValue" } } })
      .expect(200);

    assert.deepEqual(requestService.allMeta(), { someKey: "someValue" });
  });

  test("get all meta from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ meta: { someKey: "someValue" } })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.allMeta(), { someKey: "someValue" });
  });

  test("get only some attribute from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          attributes: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["someKey"]), {
      someKey: "someValue"
    });
  });

  test("get only some attribute from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ someKey: "someValue", anotherKey: "anotherValue" })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.onlyAttributes(["someKey"]), {
      someKey: "someValue"
    });
  });

  test("get only some meta from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          meta: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.deepEqual(requestService.onlyMeta(["someKey"]), {
      someKey: "someValue"
    });
  });

  test("get only some meta from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ meta: { someKey: "someValue", anotherKey: "anotherValue" } })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.onlyMeta(["someKey"]), {
      someKey: "someValue"
    });
  });

  test("get except some attribute from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          attributes: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.deepEqual(requestService.exceptAttributes(["someKey"]), {
      anotherKey: "anotherValue"
    });
  });

  test("get only some attribute from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ someKey: "someValue", anotherKey: "anotherValue" })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.exceptAttributes(["someKey"]), {
      anotherKey: "anotherValue"
    });
  });

  test("get except some meta from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          meta: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.deepEqual(requestService.exceptMeta(["someKey"]), {
      anotherKey: "anotherValue"
    });
  });

  test("get only some attribute from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ meta: { someKey: "someValue", anotherKey: "anotherValue" } })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.deepEqual(requestService.exceptMeta(["someKey"]), {
      anotherKey: "anotherValue"
    });
  });

  test("get input attribute from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          attributes: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.equal(requestService.inputAttribute("someKey"), "someValue");
  });

  test("get input attribute from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ someKey: "someValue", anotherKey: "anotherValue" })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.equal(requestService.inputAttribute("someKey"), "someValue");
  });

  test("get input meta from serialized body", async assert => {
    let requestService;

    const server = helpers.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send({
        data: {
          meta: { someKey: "someValue", anotherKey: "anotherValue" }
        }
      })
      .expect(200);

    assert.equal(requestService.inputMeta("someKey"), "someValue");
  });

  test("get input attribute from deserialized body", async assert => {
    let requestService;

    const server = helpers.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send({ meta: { someKey: "someValue", anotherKey: "anotherValue" } })
      .expect(200);

    assert.deepEqual(requestService.config, { deserializeBody: true });
    assert.equal(requestService.inputMeta("someKey"), "someValue");
  });
});
