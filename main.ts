// DealHound — hand-in program for the black-friday-deal-finder-01 bounty.
// Node 22+, standard library only. It takes this repository's app/ and
// screenshots/ folders, copies them into the output directory, and writes the
// dossier.json the scorer reads, using the vendored make.fun
// library (vendor/makefun-frontend.ts, shipped unchanged from the kit).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Start from a clean output directory tree.
mkdirSync(outDir, { recursive: true });

// The whole static site, as-is.
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });

// The screenshots, when they exist.
const shotsDir = join(outDir, "screenshots");
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), shotsDir, { recursive: true });
}

// The dossier must be byte for byte what the library writes from the output
// tree, so it is built last, from the copied files. The limits mirror the
// scorer's caps: at most 4 screenshots of 256 KiB, app/ within 993 files and
// 16 MiB, and the dossier text within 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
