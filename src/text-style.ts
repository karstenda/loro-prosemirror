import type { Loro } from "loro-crdt";
import type { Schema } from "prosemirror-model";

function getLoroTextStyle(schema: Schema): {
  [mark: string]: { expand: "before" | "after" | "none" | "both" };
} {
  return Object.fromEntries(
    Object.entries(schema.marks).map(([markName, markType]) => [
      markName,
      { expand: markType.spec.inclusive ? "after" : "none" },
    ]),
  );
}

export function configLoroTextStyle(doc: Loro, schema: Schema) {
  doc.configTextStyle(getLoroTextStyle(schema));
}
