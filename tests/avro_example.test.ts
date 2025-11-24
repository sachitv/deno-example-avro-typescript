import { assertEquals } from "@std/assert";
import {
  AvroReader,
  AvroWriter,
  createType,
  InMemoryReadableBuffer,
} from "@sachitv/avro-typescript";
import { InfiniteInMemoryBuffer } from "../src/buffer.ts";
import { schema, users } from "../src/shared.ts";

Deno.test("round trips Avro records through memory and disk", async () => {
  const userType = createType(schema);

  const writerBuffer = new InfiniteInMemoryBuffer();
  const writer = AvroWriter.toBuffer(writerBuffer, { schema: userType });
  for (const user of users) {
    await writer.append(user);
  }
  await writer.close();

  const avroBytes = writerBuffer.getBuffer();
  const filePath = await Deno.makeTempFile({ suffix: ".avro" });
  await Deno.writeFile(filePath, avroBytes);

  const diskBytes = await Deno.readFile(filePath);
  const reader = AvroReader.fromBuffer(
    new InMemoryReadableBuffer(diskBytes.buffer),
  );
  const decoded: unknown[] = [];
  for await (const record of reader.iterRecords()) {
    decoded.push(record);
  }
  await reader.close();

  assertEquals(decoded, users);
});
