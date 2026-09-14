import type { Edge } from "@xyflow/react";

import { getNodeDefinition } from "../registry";
import type { WorkflowFlowNode } from "../stores/editor-store";
import { validateConnection } from "../src/workflow/validation/connection";

export type WorkflowValidationIssue = {
  id: string;
  nodeId?: string;
  edgeId?: string;
  field?: string;
  severity: "error" | "warning";
  message: string;
};

export function validateWorkflow(
  nodes: WorkflowFlowNode[],
  edges: Edge[]
): WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];

  validateNodes(nodes, edges, issues);
  validateEdges(nodes, edges, issues);
  validateWorkflowStructure(nodes, edges, issues);

  return issues;
}

function validateNodes(
  nodes: WorkflowFlowNode[],
  edges: Edge[],
  issues: WorkflowValidationIssue[]
) {
  for (const node of nodes) {
    const definition = getNodeDefinition(node.data.type);

    validateNodeConfiguration(
      node,
      definition,
      issues
    );

    validateRequiredInputs(
      node,
      definition.inputs,
      edges,
      issues
    );
  }
}

function validateNodeConfiguration(
  node: WorkflowFlowNode,
  definition: ReturnType<typeof getNodeDefinition>,
  issues: WorkflowValidationIssue[]
) {
  const result = definition.configSchema.safeParse(
    node.data.config
  );

  if (result.success) {
    return;
  }

  result.error.issues.forEach((issue, index) => {
    const field = issue.path[0];

    issues.push({
      id: `config-${node.id}-${String(field)}-${issue.code}-${index}`,
      nodeId: node.id,
      field:
        typeof field === "string"
          ? field
          : undefined,
      severity: "error",
      message: issue.message,
    });
  });
}

function validateRequiredInputs(
  node: WorkflowFlowNode,
  inputs: ReturnType<typeof getNodeDefinition>["inputs"],
  edges: Edge[],
  issues: WorkflowValidationIssue[]
) {
  for (const input of inputs) {
    const connected = edges.some(
      (edge) =>
        edge.target === node.id &&
        edge.targetHandle === input.id
    );

    if (!connected) {
      issues.push({
        id: `input-${node.id}-${input.id}`,
        nodeId: node.id,
        severity: "warning",
        message: `${input.label ?? input.id} is not connected.`,
      });
    }
  }
}

function validateEdges(
  nodes: WorkflowFlowNode[],
  edges: Edge[],
  issues: WorkflowValidationIssue[]
) {
  const seenConnections = new Set<string>();

  for (const edge of edges) {
    const source = nodes.find(
      (node) => node.id === edge.source
    );

    const target = nodes.find(
      (node) => node.id === edge.target
    );

    if (!source || !target) {
      issues.push({
        id: `edge-${edge.id}`,
        edgeId: edge.id,
        severity: "error",
        message: "Edge references a missing node.",
      });

      continue;
    }

    if (!edge.sourceHandle || !edge.targetHandle) {
      issues.push({
        id: `handles-${edge.id}`,
        edgeId: edge.id,
        severity: "error",
        message: "Edge is missing a source or target handle.",
      });

      continue;
    }

    const connectionKey = [
      edge.source,
      edge.sourceHandle,
      edge.target,
      edge.targetHandle,
    ].join(":");

    if (seenConnections.has(connectionKey)) {
      issues.push({
        id: `duplicate-${edge.id}`,
        edgeId: edge.id,
        severity: "error",
        message: "Duplicate connection.",
      });

      continue;
    }

    seenConnections.add(connectionKey);

    const result = validateConnection(
      {
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle,
      },
      nodes,
      edges.filter((candidate) => candidate.id !== edge.id)
    );

    if (!result.valid) {
      issues.push({
        id: `invalid-${edge.id}`,
        edgeId: edge.id,
        severity: "error",
        message: result.reason,
      });
    }
  }
}

function validateWorkflowStructure(
  nodes: WorkflowFlowNode[],
  edges: Edge[],
  issues: WorkflowValidationIssue[]
) {
  const triggerNodes = nodes.filter((node) => {
    const definition = getNodeDefinition(node.data.type);

    return definition.category === "trigger";
  });

  if (nodes.length > 0 && triggerNodes.length === 0) {
    issues.push({
      id: "workflow-no-trigger",
      severity: "error",
      message: "Workflow must contain at least one trigger.",
    });
  }

  for (const trigger of triggerNodes) {
    const hasIncomingEdge = edges.some(
      (edge) => edge.target === trigger.id
    );

    if (hasIncomingEdge) {
      issues.push({
        id: `trigger-input-${trigger.id}`,
        nodeId: trigger.id,
        severity: "error",
        message: "Trigger nodes cannot have incoming connections.",
      });
    }
  }

  validateCycles(nodes, edges, issues);
}

function validateCycles(
  nodes: WorkflowFlowNode[],
  edges: Edge[],
  issues: WorkflowValidationIssue[]
) {
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const targets = adjacency.get(edge.source);

    if (targets) {
      targets.push(edge.target);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(nodeId: string): boolean {
    if (visiting.has(nodeId)) {
      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visiting.add(nodeId);

    for (const targetId of adjacency.get(nodeId) ?? []) {
      if (visit(targetId)) {
        return true;
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);

    return false;
  }

  for (const node of nodes) {
    if (visit(node.id)) {
      issues.push({
        id: "workflow-cycle",
        severity: "error",
        message: "Workflow contains a cycle.",
      });

      return;
    }
  }
}