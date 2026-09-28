import { getNodeDefinition } from "@/workflow/registry";
import type { WorkflowFlowNode } from "@/workflow/stores/editor-store";
import type { Connection, Edge } from "@xyflow/react";

type ConnectionValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      reason: string;
    };

export function validateConnection(
  connection: Connection,
  nodes: WorkflowFlowNode[],
  edges: Edge[]
): ConnectionValidationResult {
  const sourceNode = nodes.find(
    (node) => node.id === connection.source
  );

  const targetNode = nodes.find(
    (node) => node.id === connection.target
  );

  if (!sourceNode || !targetNode) {
    return {
      valid: false,
      reason: "Source or target node does not exist.",
    };
  }

  if (sourceNode.id === targetNode.id) {
    return {
      valid: false,
      reason: "A node cannot connect to itself.",
    };
  }

  if (!connection.sourceHandle) {
    return {
      valid: false,
      reason: "Source handle is required.",
    };
  }

  if (!connection.targetHandle) {
    return {
      valid: false,
      reason: "Target handle is required.",
    };
  }

  const sourceDefinition = getNodeDefinition(
    sourceNode.data.type
  );

  const targetDefinition = getNodeDefinition(
    targetNode.data.type
  );

  const sourcePort = sourceDefinition.outputs.find(
    (port) => port.id === connection.sourceHandle
  );

  const targetPort = targetDefinition.inputs.find(
    (port) => port.id === connection.targetHandle
  );

  if (!sourcePort) {
    return {
      valid: false,
      reason: "Source handle does not exist.",
    };
  }

  if (!targetPort) {
    return {
      valid: false,
      reason: "Target handle does not exist.",
    };
  }

  if (
    sourcePort.type &&
    targetPort.type &&
    sourcePort.type !== "default" &&
    targetPort.type !== "default" &&
    sourcePort.type !== targetPort.type
  ) {
    return {
      valid: false,
      reason: `Cannot connect ${sourcePort.type} output to ${targetPort.type} input.`,
    };
  }

  const duplicateConnection = edges.some(
    (edge) =>
      edge.source === connection.source &&
      edge.sourceHandle === connection.sourceHandle &&
      edge.target === connection.target &&
      edge.targetHandle === connection.targetHandle
  );

  if (duplicateConnection) {
    return {
      valid: false,
      reason: "This connection already exists.",
    };
  }

  if (sourcePort.multiple === false) {
    const sourceAlreadyConnected = edges.some(
      (edge) =>
        edge.source === connection.source &&
        edge.sourceHandle === connection.sourceHandle
    );

    if (sourceAlreadyConnected) {
      return {
        valid: false,
        reason: "This output already has a connection.",
      };
    }
  }

  if (targetPort.multiple === false) {
    const targetAlreadyConnected = edges.some(
      (edge) =>
        edge.target === connection.target &&
        edge.targetHandle === connection.targetHandle
    );

    if (targetAlreadyConnected) {
      return {
        valid: false,
        reason: "This input already has a connection.",
      };
    }
  }

  return {
    valid: true,
  };
}