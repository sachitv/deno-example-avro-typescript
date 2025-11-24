# Deno Avro TypeScript Example

This repo shows how to use `jsr:@sachitv/avro-typescript` from Deno in both a
CLI script and a small browser demo. Everything is TypeScript and uses only
Deno’s built-in tooling with a DOM-simulated e2e test for coverage.

## Prerequisites

- Install Deno 2.x
- The examples fetch dependencies directly from [JSR](https://jsr.io); you can
  also pin them locally with `deno add jsr:@sachitv/avro-typescript`.

## Tasks

- `deno task fmt` / `deno task fmt:check` — format with `deno fmt`
- `deno task lint` — lint with `deno lint`
- `deno task test` — run Deno tests (includes a DOM-simulated browser flow)
- `deno task cli` — run the CLI example that writes/reads Avro data
- `deno task build` — bundle `src/browser.ts` to `dist/browser.js`
- `deno task dev` — serve the browser example at <http://localhost:3000>
- `deno task start` — build then serve

## CLI example

Write/read Avro data using the library from Deno:

```bash
deno run -A src/index.ts
```

## Browser example

Build the client bundle and serve it:

```bash
deno task build
deno task dev
```

Then open <http://localhost:3000> and click **Run Avro Example**. The page
writes the sample users to an Avro buffer and reads them back in the browser.

## Tests

```bash
deno test -A
```
