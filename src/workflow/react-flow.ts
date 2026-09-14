import type { Node } from "@xyflow/react";

import type { WorkflowNode } from "./types";

export function workflowNodeToReactFlowNode( node: WorkflowNode ): Node {
  return {
    id: node.id,

    type: "workflow",

    position: node.position,

    data: {
      type: node.type,
      config: node.config,
    },
  };
}