// Local receiver for the Acronis Token Exporter Figma plugin.
//
// Listens on http://localhost:3333 and accepts a POSTed ExportPayload from the
// plugin's UI iframe, then writes the design-tokens snapshot into
// packages/design-tokens/.tmp/figma-tokens/. Keeps running so you can re-export
// without restarting; stop with Ctrl-C.
//
//   pnpm --filter @acronis-platform/figma-token-exporter receive
//   pnpm --filter @acronis-platform/figma-token-exporter receive -- --port 4444

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { writeSnapshot, DEFAULT_OUT_DIR } from './write-snapshot.js';
import type { ExportPayload } from './types.js';

const PORT = parsePort(process.argv) ?? 3333;
// Cap the body at 64 MB — the full ~600-variable model is well under 1 MB.
const MAX_BODY_BYTES = 64 * 1024 * 1024;

function parsePort(argv: string[]): number | undefined {
  const i = argv.indexOf('--port');
  if (i !== -1 && argv[i + 1]) {
    const n = Number(argv[i + 1]);
    if (Number.isInteger(n) && n > 0 && n < 65536) return n;
  }
  if (process.env.PORT) {
    const n = Number(process.env.PORT);
    if (Number.isInteger(n) && n > 0 && n < 65536) return n;
  }
  return undefined;
}

function cors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  cors(res);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    cors(res);
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Use POST.' });
    return;
  }

  // Read the body — client faults (too large / unreadable) are 413 / 400.
  let raw: string;
  try {
    raw = await readBody(req);
  } catch (err) {
    const tooLarge = err instanceof Error && err.message === 'Payload too large';
    sendJson(res, tooLarge ? 413 : 400, {
      ok: false,
      error: tooLarge ? 'Payload too large.' : 'Could not read request body.',
    });
    return;
  }

  // Parse + validate — malformed input is the client's fault (400).
  let payload: ExportPayload;
  try {
    payload = JSON.parse(raw) as ExportPayload;
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON payload.' });
    return;
  }
  if (payload?.exporter !== 'acronis-figma-token-exporter') {
    sendJson(res, 400, { ok: false, error: 'Unrecognized payload (missing exporter marker).' });
    return;
  }

  // Write — a failure here is a server fault (500). Log details locally; return
  // a generic message so internal/stack details aren't exposed to the client.
  try {
    const { files } = writeSnapshot(payload);

    console.log(
      `\n✓ Wrote snapshot from "${payload.fileName}" ` +
        `(${payload.variables.length} variables, ${payload.collections.length} collections, ` +
        `${payload.orphanVariables.length} resolved orphans, ${payload.textStyles.length} text styles):`,
    );
    for (const f of files) console.log(`  ${f}`);
    console.log('\nReady for the next export, or Ctrl-C to stop.');

    sendJson(res, 200, { ok: true, files });
  } catch (error) {
    console.error('✗ Failed to write snapshot:', error instanceof Error ? (error.stack ?? error.message) : String(error));
    sendJson(res, 500, { ok: false, error: 'Internal error writing the snapshot — see the receiver logs.' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Acronis Token Exporter receiver listening on http://localhost:${PORT}`);
  console.log(`Writes into: ${DEFAULT_OUT_DIR}`);
  console.log('In Figma: run the "Acronis Token Exporter" plugin, then click "Send snapshot to repo".');
  console.log('Leave this running; Ctrl-C to stop.\n');
});
