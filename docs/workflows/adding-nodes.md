# Adding Workflow Nodes

This guide describes how to add a new workflow node to Atlas.

A workflow node has two sides:

1. **Frontend definition** — how the node is configured and displayed in the workflow builder.
2. **Backend runtime** — how the node executes inside the LangGraph workflow.

Both sides must agree on the node's **type**, **configuration shape**, and **execution semantics**.

---

## Architecture

```text
Frontend
  │
  ├── Node Definition
  │     ├── type
  │     ├── config schema
  │     ├── default config
  │     ├── inputs / outputs
  │     └── config form
  │
  └── Node Registry
          │
          ▼
      Workflow Definition
          │
          ▼
Backend
  │
  ├── Runtime Registry
  │     └── node_type → NodeRuntime
  │
  ├── LangGraph Compiler
  │
  └── Node Runtime
        ├── resolve config
        ├── execute
        └── return NodeExecutionResult
```

The frontend definition describes the node. The backend runtime executes it.

Do not expose a frontend node that has no backend runtime unless the node is intentionally editor-only.

---

# 1. Choose the Node Type

The node type is the stable identifier shared between frontend and backend.

For example:

```text
httpRequest
```

The same value must be used in:

```text
Frontend definition
Frontend registry
Backend runtime.node_type
Backend runtime registry
Workflow definition
```

Use a short camelCase identifier.

Examples:

```text
webhook
httpRequest
condition
setVariable
llm
tool
```

Avoid changing a node type after workflows have been persisted unless a migration strategy exists.

---

# 2. Define the Backend Runtime First

Create:

```text
apps/workflows/execution/runtime/<node-name>.py
```

A runtime implements `NodeRuntime`:

```python
from apps.workflows.execution.context import resolve_config
from apps.workflows.execution.runtime.base import (
    NodeExecutionContext,
    NodeExecutionResult,
    NodeRuntime,
)


class ExampleRuntime(NodeRuntime):
    node_type = "example"

    async def execute(
        self,
        context: NodeExecutionContext,
    ) -> NodeExecutionResult:
        config = resolve_config(
            context.config,
            context,
        )

        return NodeExecutionResult(
            output={
                "result": config.get("value"),
            },
        )
```

The runtime receives:

```python
NodeExecutionContext(
    execution_id=...,
    node_id=...,
    config=...,
    input=...,
    node_outputs=...,
    variables=...,
)
```

It should not access Django request objects, workflow models, or frontend concerns directly.

---

# 3. Resolve Configuration

Workflow configuration can contain references such as:

```text
{{input.name}}
{{nodes.webhook.body.email}}
{{variables.customer_id}}
```

Resolve configuration through the shared resolver:

```python
config = resolve_config(
    context.config,
    context,
)
```

Do this before interpreting configuration values.

This keeps reference resolution consistent across runtimes.

Do not implement custom `{{...}}` parsing inside individual runtimes.

---

# 4. Validate Runtime Configuration

Invalid configuration should raise:

```python
NodeRuntimeConfigurationError
```

Example:

```python
if not isinstance(config.get("name"), str):
    raise NodeRuntimeConfigurationError(
        "Example name must be a string."
    )
```

Configuration errors represent problems with the node definition/configuration.

Execution failures should instead use:

```python
NodeRuntimeExecutionError
```

For example:

```python
try:
    result = await external_service.execute(...)
except Exception as exc:
    raise NodeRuntimeExecutionError(
        f"Example execution failed: {exc}"
    ) from exc
```

The execution layer serializes runtime errors into:

```json
{
  "code": "runtime_configuration_error",
  "message": "...",
  "type": "NodeRuntimeConfigurationError"
}
```

or:

```json
{
  "code": "runtime_execution_error",
  "message": "...",
  "type": "NodeRuntimeExecutionError"
}
```

Unknown/unexpected exceptions are normalized as:

```json
{
  "code": "runtime_error",
  "message": "...",
  "type": "..."
}
```

---

# 5. Return a NodeExecutionResult

Runtimes should return:

```python
NodeExecutionResult(
    output={...},
)
```

The output becomes available to downstream nodes through:

```text
{{nodes.<node-id>.<path>}}
```

For example, if the runtime returns:

```python
NodeExecutionResult(
    output={
        "customer": {
            "id": "123",
            "name": "Ben",
        },
    },
)
```

a downstream node can reference:

```text
{{nodes.customer-lookup.customer.name}}
```

---

# 6. Output Handles

Most nodes simply return:

```python
NodeExecutionResult(
    output={...},
)
```

Branching nodes can return an output handle:

```python
NodeExecutionResult(
    output={
        "result": True,
    },
    output_handle="true",
)
```

The compiler uses this handle to determine which outgoing edge should be traversed.

The condition node is the current example:

```text
condition
   ├── true
   └── false
```

When adding a branching node, document its output handles explicitly.

---

# 7. Variables

A runtime can update workflow variables through:

```python
NodeExecutionResult(
    output={...},
    variables={
        "customer_id": "123",
    },
)
```

The compiler merges returned variables into workflow state.

Downstream nodes can then resolve:

```text
{{variables.customer_id}}
```

Do not mutate `context.variables` directly.

Return changes through `NodeExecutionResult.variables`.

---

# 8. Register the Runtime

Add the runtime to:

```text
apps/workflows/execution/runtime/registry.py
```

For example:

```python
registry.register(ExampleRuntime())
```

If the runtime requires an external dependency, keep that dependency injectable.

For example, LLM and Tool runtimes use factories/resolvers rather than constructing provider-specific dependencies inside the runtime registry.

---

# 9. Add the Frontend Definition

Create:

```text
src/workflow/definitions/<node-name>.ts
```

A definition should contain:

* node type
* label
* description
* category
* inputs
* outputs
* config schema
* default config
* fields
* config component

Example:

```ts
import { z } from "zod";

import type { NodeDefinition } from "../types";
import { ExampleConfigForm } from "./configs/example-config";

const exampleConfigSchema = z.object({
  value: z.string(),
});

export type ExampleConfig = z.infer<
  typeof exampleConfigSchema
>;

export const exampleNode: NodeDefinition<ExampleConfig> = {
  type: "example",

  label: "Example",

  description: "Example workflow node.",

  category: "action",

  inputs: [
    {
      id: "input",
      label: "Input",
      type: "default",
    },
  ],

  outputs: [
    {
      id: "output",
      label: "Output",
      type: "default",
    },
  ],

  defaultConfig: {
    value: "",
  },

  configSchema: exampleConfigSchema,

  fields: [
    {
      name: "value",
      label: "Value",
      type: "text",
      placeholder: "{{input.value}}",
    },
  ],

  configComponent: ExampleConfigForm,
};
```

Zod is used both for runtime validation and TypeScript type inference. `z.infer` keeps the TypeScript config type derived from the schema instead of maintaining a second type definition.

---

# 10. Add the Config Form

Create:

```text
src/workflow/definitions/configs/<node-name>-config.tsx
```

The form receives:

```ts
type NodeConfigProps<TConfig> = {
  value: TConfig;
  onChange: (value: TConfig) => void;
};
```

Keep the form responsible for editing configuration only.

It should not:

* execute the node
* call the backend runtime
* contain workflow traversal logic
* duplicate backend execution logic

For structured configuration, use the actual configuration shape.

For example, a discriminated configuration such as Set Variable can use:

```ts
z.discriminatedUnion("operation", [
  ...
])
```

This allows the discriminator to determine which configuration variant should be validated.

---

# 11. Register the Frontend Node

Add the definition to:

```text
src/workflow/registry.ts
```

Example:

```ts
import { exampleNode } from "./definitions/example";

export const nodeRegistry = {
  webhook: webhookNode,
  httpRequest: httpRequestNode,
  condition: conditionNode,
  setVariable: setVariableNode,
  llm: llmNode,
  tool: toolNode,
  example: exampleNode,
};
```

The registry determines the frontend `NodeType`:

```ts
export type NodeType = keyof typeof nodeRegistry;
```

This means adding a node to the registry also makes its type available to the workflow editor.

---

# 12. Keep Frontend and Backend Configs in Sync

This is the most important rule.

For every node, compare:

```text
Frontend Zod schema
        ↕
Backend runtime config
```

For example:

### Condition

Frontend:

```text
left
operator
right
trueHandle
falseHandle
```

Backend:

```text
left
operator
right
trueHandle
falseHandle
```

### HTTP Request

Frontend:

```text
method
url
headers
query
body
```

Backend:

```text
method
url
headers
query
body
```

Do not add frontend-only configuration unless there is a deliberate reason for it.

For example, `webhook.path` was removed because the current backend runtime does not consume it.

---

# 13. Decide the Output Contract

Before implementing a node, define what its output looks like.

For example:

```python
NodeExecutionResult(
    output={
        "status": 200,
        "body": {...},
    },
)
```

Then downstream nodes can reliably consume:

```text
{{nodes.request.status}}
{{nodes.request.body.email}}
```

Output shape is part of the node's contract.

Avoid changing it casually after workflows have been persisted.

---

# 14. Add Tests

At minimum, test the runtime directly.

Recommended cases:

### Configuration

```text
valid configuration
missing required configuration
invalid configuration
```

### Execution

```text
successful execution
external/service failure
```

### Workflow integration

```text
node executes inside LangGraph
node output reaches downstream node
variables propagate when applicable
branching works when applicable
runtime errors are persisted
```

For example:

```text
Example → Set Variable
```

should verify that the second node can resolve output from the first.

For branching:

```text
Condition
   ├── true → Node A
   └── false → Node B
```

test both paths.

---

# 15. Checklist

When adding a node:

```text
[ ] Choose stable node type
[ ] Define backend runtime
[ ] Resolve config through resolve_config()
[ ] Validate runtime configuration
[ ] Handle execution failures
[ ] Return NodeExecutionResult
[ ] Define output shape
[ ] Define output handles if branching
[ ] Return variables if applicable
[ ] Register backend runtime
[ ] Add frontend definition
[ ] Add Zod config schema
[ ] Add default config
[ ] Add config form
[ ] Register frontend node
[ ] Verify frontend/backend config parity
[ ] Add runtime tests
[ ] Add integration test
[ ] Run frontend checks
[ ] Run backend tests
```

---

# Existing Nodes

| Node          | Purpose                  | Branching | Variables |
| ------------- | ------------------------ | --------: | --------: |
| `webhook`     | Normalize workflow input |        No |        No |
| `httpRequest` | Make HTTP requests       |        No |        No |
| `condition`   | Evaluate a condition     |       Yes |        No |
| `setVariable` | Set/transform variables  |        No |       Yes |
| `llm`         | Invoke a chat model      |        No |        No |
| `tool`        | Execute a LangChain tool |        No |        No |

`noop` exists as an internal runtime but is not exposed as a user-facing workflow node.

---

# Design Principles

### 1. Runtime owns execution

The backend runtime is the source of truth for execution behavior.

### 2. Frontend owns configuration UX

The frontend should make valid runtime configuration easy to construct.

### 3. Shared resolver

Use `resolve_config()` instead of implementing node-specific reference resolution.

### 4. Explicit contracts

Configuration and output shapes should be explicit and stable.

### 5. Dependency injection

External providers such as LLMs and tools should be injected through factories/resolvers rather than embedded into workflow definitions.

### 6. Structured errors

Use the runtime error classes instead of returning arbitrary error dictionaries.

### 7. Keep nodes small

A node runtime should primarily:

```text
resolve
validate
execute
return
```

Complex infrastructure belongs outside the node runtime.

---

# Adding a Node — Short Version

For quick reference:

```text
1. Backend runtime
   ↓
2. Runtime tests
   ↓
3. Register runtime
   ↓
4. Frontend definition
   ↓
5. Config form
   ↓
6. Register frontend node
   ↓
7. Verify config/output parity
   ↓
8. Integration test
```

If the frontend and backend contracts cannot be described with the same configuration table, stop and reconcile them before continuing.
