import net from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { ImageThreatError, scanProjectImage } from "@/lib/media-scan";

async function withScanner(reply: string, callback: () => Promise<void>) {
  const server = net.createServer((socket) => {
    let received = Buffer.alloc(0);
    socket.on("data", (chunk) => {
      received = Buffer.concat([received, chunk]);
      if (received.subarray(0, 10).toString() !== "zINSTREAM\0") return;
      const length = received.readUInt32BE(10);
      if (received.length >= 18 + length) socket.end(reply + "\0");
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Unexpected test socket");
  process.env.CLAMAV_HOST = "127.0.0.1";
  process.env.CLAMAV_PORT = String(address.port);
  try {
    await callback();
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

describe("ClamAV INSTREAM adapter", () => {
  afterEach(() => {
    delete process.env.CLAMAV_HOST;
    delete process.env.CLAMAV_PORT;
  });

  it("accepts only an explicit clean response", async () => {
    await withScanner("stream: OK", async () => {
      await expect(scanProjectImage(Buffer.from("test-image"))).resolves.toBeUndefined();
    });
  });

  it("rejects a scanner detection", async () => {
    await withScanner("stream: Eicar-Test-Signature FOUND", async () => {
      await expect(scanProjectImage(Buffer.from("test-image"))).rejects.toBeInstanceOf(ImageThreatError);
    });
  });
});
