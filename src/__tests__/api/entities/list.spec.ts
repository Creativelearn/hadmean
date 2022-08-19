import handler from "pages/api/entities/list";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";

describe("/api/entities/list", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema"]);
  });

  it("should list all entities", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "foo",
          "value": "foo",
        },
        Object {
          "label": "bar",
          "value": "bar",
        },
        Object {
          "label": "baz",
          "value": "baz",
        },
        Object {
          "label": "fish",
          "value": "fish",
        },
      ]
    `);
  });
});