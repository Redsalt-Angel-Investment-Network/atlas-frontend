"use client";

import { useCallback } from "react";
import type { ReactFlowInstance } from "@xyflow/react";

import { nodeRegistry } from "@/workflow/registry";
import type { NodeCategory, NodeDefinition } from "@/workflow/types";

const categoryLabels: Record<NodeCategory, string> = {
  trigger: "Triggers",
  action: "Actions",
  logic: "Logic",
};

const categoryOrder: NodeCategory[] = [
  "trigger",
  "action",
  "logic",
];

type WorkflowNodeLibraryProps = Record<string, never>;

export function WorkflowNodeLibrary({
  onDragStart,
}: WorkflowNodeLibraryProps) {
  const definitions = Object.values(nodeRegistry);

  const definitionsByCategory = categoryOrder.map((category) => ({
    category,
    definitions: definitions.filter(
      (definition) => definition.category === category
    ),
  }));

  return (
    <aside className="w-64 shrink-0 border-r bg-background">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Nodes</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag a node onto the canvas.
        </p>
      </div>

      <div className="space-y-6 p-3">
        {definitionsByCategory.map(
          ({ category, definitions }) => {
            if (definitions.length === 0) {
              return null;
            }

            return (
              <div key={category} className="space-y-2">
                <div className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {categoryLabels[category]}
                </div>

                <div className="space-y-2">
                  {definitions.map((definition) => (
                    <NodeLibraryItem
                      key={definition.type}
                      definition={definition}
                    />
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </aside>
  );
}

type NodeLibraryDefinition = Pick<
  NodeDefinition<never>,
  "type" | "label" | "description"
>;

type NodeLibraryItemProps = {
  definition: NodeLibraryDefinition;
};

function NodeLibraryItem({
  definition,
}: NodeLibraryItemProps) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "application/workflow-node",
          definition.type
        );

        event.dataTransfer.effectAllowed = "move";
      }}
      className="w-full cursor-grab rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent active:cursor-grabbing"
    >
      <div className="text-sm font-medium">
        {definition.label}
      </div>

      {definition.description && (
        <div className="mt-1 text-xs text-muted-foreground">
          {definition.description}
        </div>
      )}
    </button>
  );
}