import { webhookNode } from "./definitions/webhook";
import { httpRequestNode } from "./definitions/http-request";
import { conditionNode } from "./definitions/condition";

export const nodeRegistry = {
  webhook: webhookNode,
  httpRequest: httpRequestNode,
  condition: conditionNode,
};

export type NodeType = keyof typeof nodeRegistry;

export type AnyNodeDefinition =
  (typeof nodeRegistry)[NodeType];

export function isNodeType(
  type: string
): type is NodeType {
  return type in nodeRegistry;
}

export function getNodeDefinition<T extends NodeType>(
  type: T
): (typeof nodeRegistry)[T] {
  return nodeRegistry[type];
}