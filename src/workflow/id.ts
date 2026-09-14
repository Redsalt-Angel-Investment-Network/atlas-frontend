export function createWorkflowNodeId(type: string) {
  return `${type}-${crypto.randomUUID()}`;
}