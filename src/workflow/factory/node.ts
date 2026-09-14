import { getNodeDefinition, NodeType } from "../registry";
import type { WorkflowNode } from "../types";

export function createWorkflowNode(
  type: NodeType,
  position: { x: number; y: number }
): WorkflowNode {
  const definition = getNodeDefinition(type);

  return {
    id: crypto.randomUUID(),
    type,
    position,
    config: structuredClone(definition.defaultConfig),
  };
}