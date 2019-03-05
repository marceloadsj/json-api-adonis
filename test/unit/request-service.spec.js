const test = require("japa");
const supertest = require("supertest");

const requestServiceHelper = require("./requestServiceHelper");

const serializedObjectBody = {
  data: {
    attributes: { name: "Marcelo Junior", gender: "male" },
    meta: { profile: "github.com/marceloadsj", username: "marceloadsj" }
  }
};

const deserializedObjectBody = {
  ...serializedObjectBody.data.attributes,
  meta: serializedObjectBody.data.meta
};

const objectAttributes = serializedObjectBody.data.attributes;

const objectMeta = serializedObjectBody.data.meta;

const serializedArrayBody = {
  data: [
    { ...serializedObjectBody.data },
    {
      attributes: { name: "Suellen Siqueira", gender: "female" },
      meta: { profile: null, username: "unknown" }
    }
  ]
};

const deserializedArrayBody = [
  {
    ...serializedArrayBody.data[0].attributes,
    meta: serializedArrayBody.data[0].meta
  },
  {
    ...serializedArrayBody.data[1].attributes,
    meta: serializedArrayBody.data[1].meta
  }
];

const arrayAttributes = [
  serializedArrayBody.data[0].attributes,
  serializedArrayBody.data[1].attributes
];

const arrayMeta = [
  serializedArrayBody.data[0].meta,
  serializedArrayBody.data[1].meta
];

test.group("RequestService", () => {
  test("get all attributes from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.allAttributes(), objectAttributes);
  });

  test("get all attributes from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.allAttributes(), objectAttributes);
  });

  test("get all attributes from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.allAttributes(), arrayAttributes);
  });

  test("get all attributes from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.allAttributes(), arrayAttributes);
  });

  test("get all meta from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.allMeta(), objectMeta);
  });

  test("get all meta from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.allMeta(), objectMeta);
  });

  test("get all meta from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.allMeta(), arrayMeta);
  });

  test("get all meta from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.allMeta(), arrayMeta);
  });

  test("get only some attribute from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), {
      name: "Marcelo Junior"
    });
  });

  test("get only some attribute from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), {
      name: "Marcelo Junior"
    });
  });

  test("get only some attribute from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), [
      { name: "Marcelo Junior" },
      { name: "Suellen Siqueira" }
    ]);
  });

  test("get only some attribute from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), [
      { name: "Marcelo Junior" },
      { name: "Suellen Siqueira" }
    ]);
  });

  test("get only some meta from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyMeta(["profile"]), {
      profile: "github.com/marceloadsj"
    });
  });

  test("get only some meta from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyMeta(["profile"]), {
      profile: "github.com/marceloadsj"
    });
  });

  test("get only some meta from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyMeta(["profile"]), [
      { profile: "github.com/marceloadsj" },
      { profile: null }
    ]);
  });

  test("get only some meta from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyMeta(["profile"]), [
      { profile: "github.com/marceloadsj" },
      { profile: null }
    ]);
  });

  test("get except some attribute from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.exceptAttributes(["name"]), {
      gender: "male"
    });
  });

  test("get except some attribute from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.exceptAttributes(["name"]), [
      { gender: "male" },
      { gender: "female" }
    ]);
  });

  test("get except some meta from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.exceptMeta(["profile"]), {
      username: "marceloadsj"
    });
  });

  test("get except some meta from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.exceptMeta(["profile"]), [
      { username: "marceloadsj" },
      { username: "unknown" }
    ]);
  });

  test("get only some attribute from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), {
      name: "Marcelo Junior"
    });
  });

  test("get only some attribute from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), {
      name: "Marcelo Junior"
    });
  });

  test("get only some attribute from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), [
      { name: "Marcelo Junior" },
      { name: "Suellen Siqueira" }
    ]);
  });

  test("get only some attribute from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.onlyAttributes(["name"]), [
      { name: "Marcelo Junior" },
      { name: "Suellen Siqueira" }
    ]);
  });

  test("get input attribute from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.equal(requestService.inputAttribute("name"), "Marcelo Junior");
  });

  test("get input attribute from deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.equal(requestService.inputAttribute("name"), "Marcelo Junior");
  });

  test("get input attribute from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.inputAttribute("name"), [
      "Marcelo Junior",
      "Suellen Siqueira"
    ]);
  });

  test("get input attribute from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.inputAttribute("name"), [
      "Marcelo Junior",
      "Suellen Siqueira"
    ]);
  });

  test("get input meta from object serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedObjectBody)
      .expect(200);

    assert.equal(requestService.inputMeta("profile"), "github.com/marceloadsj");
  });

  test("get input meta from object deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedObjectBody)
      .expect(200);

    assert.equal(requestService.inputMeta("profile"), "github.com/marceloadsj");
  });

  test("get input meta from array serialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(request => {
      requestService = request;
    });

    await supertest(server)
      .post("/")
      .send(serializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.inputMeta("profile"), [
      "github.com/marceloadsj",
      null
    ]);
  });

  test("get input meta from array deserialized body", async assert => {
    let requestService;

    const server = requestServiceHelper.createServer(
      request => {
        requestService = request;
      },
      { deserializeBody: true }
    );

    await supertest(server)
      .post("/")
      .send(deserializedArrayBody)
      .expect(200);

    assert.deepEqual(requestService.inputMeta("profile"), [
      "github.com/marceloadsj",
      null
    ]);
  });
});
