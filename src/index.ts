import {
  AvroReader,
  AvroWriter,
  createType,
  InMemoryReadableBuffer,
} from "@sachitv/avro-typescript";
import { InfiniteInMemoryBuffer } from "./buffer.ts";
import { schema, users } from "./shared.ts";

// Create a Type from the schema
const userType = createType(schema);

async function main() {
  console.log("Running Avro TypeScript example with Deno...");

  // Write user data to an in-memory buffer using AvroWriter
  const memoryBuffer = new InfiniteInMemoryBuffer();
  const writer = AvroWriter.toBuffer(memoryBuffer, { schema: userType });
  const numWritten = users.length;

  for (const user of users) {
    await writer.append(user);
  }
  await writer.close();
  console.log(`Data written to in-memory buffer: ${numWritten} records.`);

  // Save the in-memory buffer to an Avro file
  const avroBuffer = memoryBuffer.getBuffer();
  const filePath = await Deno.makeTempFile({ suffix: ".avro" });
  await Deno.writeFile(filePath, avroBuffer);
  console.log(`In-memory buffer saved to ${filePath}`);

  // Read the Avro file back into a buffer
  const fileContent = await Deno.readFile(filePath);
  console.log(`${filePath} read back into a buffer.`);

  // Use AvroReader to parse the data and log it to the console
  const reader = AvroReader.fromBuffer(
    new InMemoryReadableBuffer(fileContent.buffer),
  );
  console.log("Reading records from Avro file:");
  let numRead = 0;
  for await (const record of reader.iterRecords()) {
    console.log(record);
    numRead++;
  }
  await reader.close();

  if (numRead !== numWritten) {
    console.error(
      `Record count mismatch: wrote ${numWritten}, read ${numRead}`,
    );
  } else {
    console.log(
      `Record count verified: ${numRead} records read match ${numWritten} written.`,
    );
  }

  console.log("Example finished.");
}

main().catch(console.error);
