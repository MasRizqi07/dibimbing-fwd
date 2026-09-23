import net from "node:net";

export class ImageThreatError extends Error {}

export async function scanProjectImage(image: Buffer): Promise<void> {
  const socketPath = process.env.CLAMAV_SOCKET_PATH;
  const host = process.env.CLAMAV_HOST;
  if (!socketPath && !host) {
    if (process.env.NODE_ENV === "production") throw new Error("Image scanner is not configured");
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const socket = socketPath
      ? net.createConnection(socketPath)
      : net.createConnection({ host: host!, port: Number(process.env.CLAMAV_PORT || 3310) });
    let settled = false;
    let reply = "";
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve();
    };
    socket.setTimeout(10_000, () => finish(new Error("Image scan timed out")));
    socket.on("error", (error) => finish(error));
    socket.on("connect", () => {
      const length = Buffer.alloc(4);
      length.writeUInt32BE(image.length);
      socket.write("zINSTREAM\0");
      socket.write(length);
      socket.write(image);
      socket.write(Buffer.alloc(4));
    });
    socket.on("data", (chunk: Buffer) => {
      reply += chunk.toString("utf8");
      if (reply.length > 4096) return finish(new Error("Invalid image scan response"));
      if (reply.includes("\0")) {
        if (/^stream: OK\0$/.test(reply)) finish();
        else if (reply.includes("FOUND")) finish(new ImageThreatError("Berkas ditolak oleh pemindai keamanan."));
        else finish(new Error("Image scanner returned an error"));
      }
    });
    socket.on("end", () => {
      if (!settled) finish(new Error("Image scan ended without a clean response"));
    });
  });
}
