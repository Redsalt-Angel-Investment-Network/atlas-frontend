import { webhookNode } from "./definitions/webhook";
import { httpRequestNode } from "./definitions/http-request";
import { conditionNode } from "./definitions/condition";
import { setVariableNode } from "./definitions/set-variable";
import { llmNode } from "./definitions/llm";
import { toolNode } from "./definitions/tool";
import { agentNode } from "./definitions/agent";

export const nodeRegistry = {
  webhook: webhookNode,
  httpRequest: httpRequestNode,
  condition: conditionNode,
  setVariable: setVariableNode,
  llm: llmNode,
  tool: toolNode,
  agent: agentNode,
};

export type NodeType = keyof typeof nodeRegistry;

export type AnyNodeDefinition =
  (typeof nodeRegistry)[NodeType];

export function isNodeType(
  type: string,
): type is NodeType {
  return type in nodeRegistry;
}

export function getNodeDefinition<T extends NodeType>(
  type: T,
): (typeof nodeRegistry)[T] {
  return nodeRegistry[type];
}
