import { serveDir } from "@std/http/file-server";

type StartServerOptions = {
  port?: number;
  root?: string;
};

export function startServer(
  { port = 3000, root = "." }: StartServerOptions = {},
) {
  const controller = new AbortController();
  const handler = (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const redirected = new URL("/src/index.html", req.url);
      return serveDir(new Request(redirected, req), {
        fsRoot: root,
        quiet: true,
      });
    }
    return serveDir(req, { fsRoot: root, quiet: true });
  };
  const server = Deno.serve(
    { port, signal: controller.signal },
    handler,
  );

  const address = server.addr as Deno.NetAddr;
  return {
    port: address.port,
    close: () => controller.abort(),
    finished: server.finished,
  };
}

if (import.meta.main) {
  const { port } = startServer();
  console.log(`Server running at http://localhost:${port}`);
}
