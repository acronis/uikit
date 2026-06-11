// Acronis Token Exporter — Figma plugin (main thread).
//
// Reads local variables, collections, and text/paint/effect styles via the
// Plugin API, resolves any cross-library alias targets (so the meta sidecar
// covers every referenced VariableID), and hands the raw payload to the UI
// iframe. The UI POSTs it to a local receiver that writes the design-tokens
// snapshot. This file is intentionally "dumb": all DTCG/format logic lives in
// the Node side (src/convert.ts) where it is typed and unit-tested.
//
// Plain ES (no bundler). Avoid optional chaining for older sandbox safety.

/* global figma, __html__ */

var PLUGIN_VERSION = '0.1.0';

figma.showUI(__html__, { width: 340, height: 240, themeColors: true });

function serializeVariable(v) {
  return {
    id: v.id,
    name: v.name,
    resolvedType: v.resolvedType,
    valuesByMode: v.valuesByMode,
    variableCollectionId: v.variableCollectionId,
    scopes: v.scopes,
    description: v.description,
    hiddenFromPublishing: v.hiddenFromPublishing,
  };
}

function serializeCollection(c) {
  return {
    id: c.id,
    name: c.name,
    modes: c.modes,
    defaultModeId: c.defaultModeId,
    variableIds: c.variableIds,
  };
}

function serializeTextStyle(s) {
  return {
    id: s.id,
    name: s.name,
    fontName: s.fontName,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    textCase: s.textCase,
    textDecoration: s.textDecoration,
  };
}

function serializePaintStyle(s) {
  return { id: s.id, name: s.name, paints: s.paints };
}

function serializeEffectStyle(s) {
  return { id: s.id, name: s.name, effects: s.effects };
}

// Collect every VariableID referenced as an alias by any variable's value.
function collectAliasIds(variables) {
  var ids = {};
  for (var i = 0; i < variables.length; i++) {
    var vbm = variables[i].valuesByMode || {};
    for (var modeId in vbm) {
      if (!Object.prototype.hasOwnProperty.call(vbm, modeId)) continue;
      var val = vbm[modeId];
      if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS' && val.id) {
        ids[val.id] = true;
      }
    }
  }
  return Object.keys(ids);
}

async function buildPayload() {
  var variables = await figma.variables.getLocalVariablesAsync();
  var collections = await figma.variables.getLocalVariableCollectionsAsync();

  var localIds = {};
  for (var i = 0; i < variables.length; i++) localIds[variables[i].id] = true;

  // Resolve alias targets that aren't in the local set (cross-library /
  // "orphan" IDs). getLocalVariablesAsync misses these, but the snapshot's
  // meta sidecar must still cover them or the sync's orphan-coverage gate
  // fails. Fetching them here is what lets that gate pass on the first run.
  var aliasIds = collectAliasIds(variables);
  var orphanVariables = [];
  for (var a = 0; a < aliasIds.length; a++) {
    var id = aliasIds[a];
    if (localIds[id]) continue;
    try {
      var ov = await figma.variables.getVariableByIdAsync(id);
      if (ov) orphanVariables.push(serializeVariable(ov));
    } catch (e) {
      // getVariableByIdAsync can reject for truly unresolvable IDs — skip and
      // let the orphan-coverage gate report it. Figma's sandbox lacks optional
      // `catch {}` binding, so we bind `e` and intentionally ignore it.
      if (e) {
        /* ignored */
      }
    }
  }

  var textStyles = await figma.getLocalTextStylesAsync();
  var paintStyles = await figma.getLocalPaintStylesAsync();
  var effectStyles = await figma.getLocalEffectStylesAsync();

  return {
    exporter: 'acronis-figma-token-exporter',
    pluginVersion: PLUGIN_VERSION,
    fileKey: figma.fileKey || null,
    fileName: figma.root.name,
    exportedAt: Date.now(),
    variables: variables.map(serializeVariable),
    collections: collections.map(serializeCollection),
    orphanVariables: orphanVariables,
    textStyles: textStyles.map(serializeTextStyle),
    paintStyles: paintStyles.map(serializePaintStyle),
    effectStyles: effectStyles.map(serializeEffectStyle),
  };
}

(async function () {
  try {
    var payload = await buildPayload();
    figma.ui.postMessage({
      type: 'PAYLOAD_READY',
      payload: payload,
      summary: {
        variables: payload.variables.length,
        collections: payload.collections.length,
        orphans: payload.orphanVariables.length,
        textStyles: payload.textStyles.length,
        fileName: payload.fileName,
      },
    });
  } catch (error) {
    figma.ui.postMessage({ type: 'ERROR', error: (error && error.message) || String(error) });
  }
})();

figma.ui.onmessage = function (msg) {
  if (msg && msg.type === 'CLOSE') {
    figma.closePlugin(msg.message || undefined);
  }
};
