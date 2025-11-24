import { assertStringIncludes } from "@std/assert";
import { runExample } from "../src/browser.ts";

class FakeElement {
  textContent: string | null = null;
  constructor(public id: string) {}
  addEventListener() {}
}

class FakeDocument {
  #elements: Record<string, FakeElement>;
  constructor() {
    this.#elements = {
      output: new FakeElement("output"),
      "run-button": new FakeElement("run-button"),
    };
  }

  getElementById(id: string): FakeElement | null {
    return this.#elements[id] ?? null;
  }
}

Deno.test("browser example renders Avro output via simulated DOM", async () => {
  const doc = new FakeDocument();

  await runExample(doc as unknown as Document);

  const text = doc.getElementById("output")?.textContent ?? "";
  assertStringIncludes(
    text,
    "Avro data written to and read from in-memory buffer",
  );
  for (
    const expected of [
      '"id": "1n"',
      '"username": "user1"',
      '"email": "user1@example.com"',
      '"age": 25',
      '"id": "2n"',
      '"username": "user2"',
      '"email": "user2@example.com"',
      '"age": 30',
    ]
  ) {
    assertStringIncludes(text, expected);
  }
});
