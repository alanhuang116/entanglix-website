// Checks src/lib/hazardModels.ts against the parity cases shipped in the
// WildfireVuln and HurricaneVuln portal bundles.  Run: node scripts/check-hazard-parity.mjs
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = mkdtempSync(join(tmpdir(), "hazard-parity-"));
for (const f of ["hazardData", "hazardModels"]) {
  const src = readFileSync(join(root, "src/lib", f + ".ts"), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "ESNext", target: "ES2022" } }).outputText;
  writeFileSync(join(out, f + ".mjs"), js.replace('"./hazardData"', '"./hazardData.mjs"'));
}
const m = await import(pathToFileURL(join(out, "hazardModels.mjs")).href);
const cases = JSON.parse(readFileSync(join(root, "scripts/hazard-parity-cases.json"), "utf8"));

let worst = 0;
const diff = (a, b) => { const d = Math.abs(a - b); if (d > worst) worst = d; return d; };
for (const c of cases.wf) {
  const eta = m.wildfireEta(c.home);
  diff(eta, c.eta);
  diff(m.wildfireNewFire(eta), c.p_prior);
}
for (const c of cases.hu) {
  const r = m.hurricaneFragility(c.x);
  diff(r.any, c.p_any);
  diff(r.des, c.p_des);
}
console.log(`wildfire cases: ${cases.wf.length}, hurricane cases: ${cases.hu.length}, worst abs diff: ${worst.toExponential(2)}`);
if (worst > 1e-6) { console.error("PARITY FAILED"); process.exit(1); }
console.log("parity OK");
