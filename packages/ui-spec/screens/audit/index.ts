// Screen audit — run the structural detectors over a rendered-screen snapshot.
//
// `runScreenAudit(snapshot, descriptor)` scopes each detector:
//   - `screen` detectors run once over every node (e.g. accessible-name, contrast);
//   - `region` detectors run per descriptor region that opts into the detector's
//     rule via `regions[].rules` — measured nodes are matched to that region by
//     landmark role (`SnapshotNode.region` ↔ descriptor `ariaRole`).
//
// A region rule that no region opts into, or a `screen/*` rule with no detector
// here, is simply not enforced — same "no false confidence" contract as kit-lint.
// See context/kit-consistency-audit-proposal.md §7.
import type { RuleSeverity } from '../../grammar';
import { applyOverrides } from '../../grammar/overrides';
import type { KitOverride } from '../../grammar/overrides';
import { DETECTORS, resolveFinding } from './detectors';
import type {
  ScreenDescriptorLite,
  ScreenFinding,
  ScreenRegionLite,
  ScreenSnapshot,
  SnapshotNode,
} from './types';

export type { ScreenSnapshot, SnapshotNode, ScreenFinding } from './types';
export { collectScreenSnapshot } from './probe';
export { DETECTORS } from './detectors';

function flattenRegions(regions: ScreenRegionLite[]): ScreenRegionLite[] {
  const out: ScreenRegionLite[] = [];
  for (const r of regions) {
    out.push(r);
    if (r.children) out.push(...flattenRegions(r.children));
  }
  return out;
}

/** All raw findings for a screen, before approved overrides are applied. */
export function collectScreenFindings(
  snapshot: ScreenSnapshot,
  descriptor: ScreenDescriptorLite
): ScreenFinding[] {
  const regions = flattenRegions(descriptor.regions);
  const findings: ScreenFinding[] = [];

  for (const detector of DETECTORS) {
    if (detector.scope === 'screen') {
      for (const partial of detector.run(snapshot.nodes)) {
        findings.push(resolveFinding(partial));
      }
      continue;
    }
    // region scope: run on every region whose `rules` opt into this detector.
    for (const region of regions) {
      if (!region.rules?.includes(detector.ruleId)) continue;
      const nodes: SnapshotNode[] = region.ariaRole
        ? snapshot.nodes.filter((n) => n.region === region.ariaRole)
        : snapshot.nodes;
      for (const partial of detector.run(nodes)) {
        // Stamp the descriptor regionId (more meaningful than the landmark role).
        findings.push(resolveFinding({ ...partial, region: region.regionId }));
      }
    }
  }

  // De-dupe identical findings (a node measured under overlapping scopes).
  const seen = new Set<string>();
  return findings.filter((f) => {
    const key = `${f.ruleId}|${f.region}|${f.ref}|${f.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Findings split into active vs. suppressed by an approved override. */
export function auditScreen(
  snapshot: ScreenSnapshot,
  descriptor: ScreenDescriptorLite,
  opts: { overrides?: KitOverride[]; today?: string } = {}
): { active: ScreenFinding[]; suppressed: ScreenFinding[] } {
  return applyOverrides(
    collectScreenFindings(snapshot, descriptor),
    (f) => ({
      ruleId: f.ruleId,
      screen: descriptor.name,
      region: f.region ?? undefined,
      ref: f.ref,
    }),
    opts
  );
}

/** The active findings (approved overrides removed) — what gates CI. */
export function runScreenAudit(
  snapshot: ScreenSnapshot,
  descriptor: ScreenDescriptorLite,
  opts: { overrides?: KitOverride[]; today?: string } = {}
): ScreenFinding[] {
  return auditScreen(snapshot, descriptor, opts).active;
}

export function formatScreenReport(
  findings: ScreenFinding[],
  screen?: string
): string {
  const head = screen ? `screen-audit (${screen})` : 'screen-audit';
  if (findings.length === 0) return `${head}: no findings ✓`;
  const order: RuleSeverity[] = ['must', 'should', 'may'];
  const lines: string[] = [head];
  for (const sev of order) {
    const group = findings.filter((f) => f.severity === sev);
    if (!group.length) continue;
    lines.push(`\n${sev.toUpperCase()} (${group.length})`);
    for (const f of group) {
      const where = f.region ? `${f.region}: ${f.ref}` : f.ref;
      lines.push(`  [${f.checklist} ${f.ruleId}] ${where} — ${f.message}`);
    }
  }
  const must = findings.filter((f) => f.severity === 'must').length;
  lines.push(`\n${findings.length} finding(s); ${must} must.`);
  return lines.join('\n');
}
