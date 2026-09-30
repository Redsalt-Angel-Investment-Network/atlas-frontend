import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { create } from "zustand";

import {
  executeWorkflowApi,
  getWorkflowApi,
  getWorkflowExecutionApi,
  getWorkflowExecutionsApi,
  updateWorkflowApi,
} from "@/app/(workspace)/workflows";
import type {
  WorkflowExecutionHistoryItem,
  WorkflowExecutionResponse,
  WorkflowNodeExecutionState,
} from "@/_types/workflows";

import type { NodeType } from "../registry";
import { validateConnection } from "../validation/connection";
import {
  validateWorkflow,
  type WorkflowValidationIssue,
} from "../validation/workflow";

export type WorkflowNodeData = {
  type: NodeType;
  config: Record<string, unknown>;
  execution?: WorkflowNodeExecutionState;
};

export type WorkflowFlowNode =
  Node<WorkflowNodeData>;

export type WorkflowValidationStatus =
  | "idle"
  | "valid"
  | "invalid";

type ValidationState = {
  validationIssues: WorkflowValidationIssue[];
  validationStatus: WorkflowValidationStatus;
};

type WorkflowEditorState = {
  nodes: WorkflowFlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;

  validationIssues: WorkflowValidationIssue[];
  validationStatus: WorkflowValidationStatus;

  workflowId: string | null;
  workflowVersion: number | null;

  isLoading: boolean;
  isSaving: boolean;
  isExecuting: boolean;
  isDirty: boolean;
  saveError: string | null;
  executionError: string | null;
  execution: WorkflowExecutionResponse | null;

  executionHistory: WorkflowExecutionHistoryItem[];
  isLoadingExecutionHistory: boolean;
  executionHistoryError: string | null;

  selectedExecutionId: string | null;
  selectedExecution: WorkflowExecutionResponse | null;
  isLoadingExecution: boolean;
  executionDetailError: string | null;

  changeCounter: number;

  onNodesChange: OnNodesChange<WorkflowFlowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  selectNode: (nodeId: string | null) => void;

  updateNodeConfig: (
    nodeId: string,
    config: Record<string, unknown>
  ) => void;

  addNode: (node: WorkflowFlowNode) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;

  validate: () => void;

  loadWorkflow: (workflowId: string) => Promise<void>;

  saveWorkflow: () => Promise<void>;

  executeWorkflow: () => Promise<void>;

  loadExecutionHistory: () => Promise<void>;

  selectExecution: (
    executionId: string | null
  ) => void;

  loadExecution: (
    executionId: string
  ) => Promise<void>;
};

function getValidationState(
  nodes: WorkflowFlowNode[],
  edges: Edge[]
): ValidationState {
  const validationIssues = validateWorkflow(
    nodes,
    edges
  );

  const hasErrors = validationIssues.some(
    (issue) => issue.severity === "error"
  );

  return {
    validationIssues,
    validationStatus: hasErrors
      ? "invalid"
      : "valid",
  };
}

function shouldRevalidateNodeChanges(
  changes: Parameters<
    OnNodesChange<WorkflowFlowNode>
  >[0]
): boolean {
  return changes.some(
    (change) =>
      change.type !== "position" &&
      change.type !== "select"
  );
}

function clearExecutionState(
  nodes: WorkflowFlowNode[]
): WorkflowFlowNode[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      execution: undefined,
    },
  }));
}

function applyExecutionState(
  nodes: WorkflowFlowNode[],
  execution: WorkflowExecutionResponse
): WorkflowFlowNode[] {
  const executions = new Map(
    execution.node_executions.map(
      (nodeExecution) => [
        nodeExecution.node_id,
        nodeExecution,
      ]
    )
  );

  return nodes.map((node) => {
    const nodeExecution =
      executions.get(node.id);

    if (!nodeExecution) {
      return {
        ...node,
        data: {
          ...node.data,
          execution: undefined,
        },
      };
    }

    return {
      ...node,
      data: {
        ...node.data,
        execution: {
          status: nodeExecution.status,
          output: nodeExecution.output,
          error: nodeExecution.error,
        },
      },
    };
  });
}

const initialValidation = getValidationState(
  [],
  []
);

export const useWorkflowEditorStore =
  create<WorkflowEditorState>((set) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,

    validationIssues:
      initialValidation.validationIssues,

    validationStatus:
      initialValidation.validationStatus,

    workflowId: null,
    workflowVersion: null,

    isLoading: false,
    isSaving: false,
    isExecuting: false,
    isDirty: false,
    saveError: null,
    executionError: null,
    execution: null,

    executionHistory: [],
    isLoadingExecutionHistory: false,
    executionHistoryError: null,

    selectedExecutionId: null,
    selectedExecution: null,
    isLoadingExecution: false,
    executionDetailError: null,

    changeCounter: 0,

    onNodesChange: (changes) => {
      set((state) => {
        const nodes = applyNodeChanges(
          changes,
          state.nodes
        );

        const selectedNodeStillExists =
          state.selectedNodeId
            ? nodes.some(
              (node) =>
                node.id ===
                state.selectedNodeId
            )
            : true;

        const shouldValidate =
          shouldRevalidateNodeChanges(
            changes
          );

        const hasWorkflowChange =
          changes.some(
            (change) =>
              change.type !== "select"
          );

        const nextState: Partial<WorkflowEditorState> =
        {
          nodes,

          selectedNodeId:
            selectedNodeStillExists
              ? state.selectedNodeId
              : null,

          isDirty: hasWorkflowChange
            ? true
            : state.isDirty,

          changeCounter:
            hasWorkflowChange
              ? state.changeCounter + 1
              : state.changeCounter,
        };

        if (shouldValidate) {
          Object.assign(
            nextState,
            getValidationState(
              nodes,
              state.edges
            )
          );
        }

        return nextState;
      });
    },

    onEdgesChange: (changes) => {
      set((state) => {
        const edges = applyEdgeChanges(
          changes,
          state.edges
        );

        return {
          edges,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,
          ...getValidationState(
            state.nodes,
            edges
          ),
        };
      });
    },

    onConnect: (connection) => {
      set((state) => {
        const result =
          validateConnection(
            connection,
            state.nodes,
            state.edges
          );

        if (!result.valid) {
          console.warn(
            `Invalid workflow connection: ${result.reason}`
          );

          return state;
        }

        const edges = addEdge(
          connection,
          state.edges
        );

        return {
          edges,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,
          ...getValidationState(
            state.nodes,
            edges
          ),
        };
      });
    },

    selectNode: (nodeId) => {
      set({
        selectedNodeId: nodeId,
      });
    },

    updateNodeConfig: (
      nodeId,
      config
    ) => {
      set((state) => {
        const nodes = state.nodes.map(
          (node) => {
            if (node.id !== nodeId) {
              return node;
            }

            return {
              ...node,
              data: {
                ...node.data,
                config:
                  structuredClone(config),
              },
            };
          }
        );

        return {
          nodes,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,
          ...getValidationState(
            nodes,
            state.edges
          ),
        };
      });
    },

    addNode: (node) => {
      set((state) => {
        const nodes = [
          ...state.nodes,
          {
            ...node,
            position: {
              ...node.position,
            },
            data: {
              ...node.data,
              config:
                structuredClone(
                  node.data.config
                ),
              execution: undefined,
            },
          },
        ];

        return {
          nodes,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,
          ...getValidationState(
            nodes,
            state.edges
          ),
        };
      });
    },

    removeNode: (nodeId) => {
      set((state) => {
        const nodes =
          state.nodes.filter(
            (node) =>
              node.id !== nodeId
          );

        const edges =
          state.edges.filter(
            (edge) =>
              edge.source !== nodeId &&
              edge.target !== nodeId
          );

        return {
          nodes,
          edges,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,

          selectedNodeId:
            state.selectedNodeId ===
              nodeId
              ? null
              : state.selectedNodeId,

          ...getValidationState(
            nodes,
            edges
          ),
        };
      });
    },

    removeEdge: (edgeId) => {
      set((state) => {
        const edges =
          state.edges.filter(
            (edge) =>
              edge.id !== edgeId
          );

        return {
          edges,
          isDirty: true,
          changeCounter:
            state.changeCounter + 1,
          ...getValidationState(
            state.nodes,
            edges
          ),
        };
      });
    },

    validate: () => {
      set((state) =>
        getValidationState(
          state.nodes,
          state.edges
        )
      );
    },

    loadWorkflow: async (
      workflowId
    ) => {
      set({
        isLoading: true,
        isSaving: false,
        saveError: null,

        nodes: [],
        edges: [],
        selectedNodeId: null,

        isDirty: false,
        changeCounter: 0,

        executionHistory: [],
        isLoadingExecutionHistory: false,
        executionHistoryError: null,

        selectedExecutionId: null,
        selectedExecution: null,
        isLoadingExecution: false,
        executionDetailError: null,
      });

      try {
        const workflow =
          await getWorkflowApi(
            workflowId
          );

        const nodes =
          workflow.definition?.nodes ?? [];

        const edges =
          workflow.definition?.edges ?? [];

        const validation =
          getValidationState(
            nodes,
            edges
          );

        set({
          workflowId: workflow.id,
          workflowVersion:
            workflow.version,

          nodes: clearExecutionState(
            nodes
          ),
          edges,

          selectedNodeId: null,

          isLoading: false,
          isSaving: false,
          isExecuting: false,
          isDirty: false,
          saveError: null,
          executionError: null,
          execution: null,

          executionHistory: [],
          isLoadingExecutionHistory: false,
          executionHistoryError: null,

          selectedExecutionId: null,
          selectedExecution: null,
          isLoadingExecution: false,
          executionDetailError: null,

          changeCounter: 0,

          ...validation,
        });

        void useWorkflowEditorStore
          .getState()
          .loadExecutionHistory();
      } catch (error) {
        set({
          isLoading: false,
          isSaving: false,
          isExecuting: false,

          nodes: [],
          edges: [],
          selectedNodeId: null,

          workflowId: null,
          workflowVersion: null,

          isDirty: false,
          changeCounter: 0,

          saveError:
            error instanceof Error
              ? error.message
              : "Failed to load workflow.",

          executionError: null,
          execution: null,

          executionHistory: [],
          isLoadingExecutionHistory: false,
          executionHistoryError: null,

          selectedExecutionId: null,
          selectedExecution: null,
          isLoadingExecution: false,
          executionDetailError: null,

          ...getValidationState([], []),
        });
      }
    },

    saveWorkflow: async () => {
      const state =
        useWorkflowEditorStore.getState();

      if (
        !state.workflowId ||
        state.isSaving
      ) {
        return;
      }

      const workflowId =
        state.workflowId;

      const nodes = state.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: {
          ...node.position,
        },
        data: {
          type: node.data.type,
          config: structuredClone(
            node.data.config
          ),
        },
      }));

      const edges = structuredClone(
        state.edges
      );

      const savedChangeCounter =
        state.changeCounter;

      set({
        isSaving: true,
        saveError: null,
      });

      try {
        const workflow =
          await updateWorkflowApi(
            workflowId,
            {
              definition: {
                nodes,
                edges,
              },
            }
          );

        const currentState =
          useWorkflowEditorStore.getState();

        set({
          workflowVersion:
            workflow.version,

          isSaving: false,

          isDirty:
            currentState.changeCounter !==
            savedChangeCounter,

          saveError: null,
        });
      } catch (error) {
        set({
          isSaving: false,

          saveError:
            error instanceof Error
              ? error.message
              : "Failed to save workflow.",
        });
      }
    },

    executeWorkflow: async () => {
      const initialState =
        useWorkflowEditorStore.getState();

      if (
        !initialState.workflowId ||
        initialState.isExecuting
      ) {
        return;
      }

      const workflowId =
        initialState.workflowId;

      set({
        isExecuting: true,
        executionError: null,
        execution: null,

        selectedExecutionId: null,
        selectedExecution: null,
        executionDetailError: null,

        nodes: clearExecutionState(
          initialState.nodes
        ),
      });

      try {
        const beforeSave =
          useWorkflowEditorStore.getState();

        if (beforeSave.isDirty) {
          await beforeSave.saveWorkflow();
        }

        const currentState =
          useWorkflowEditorStore.getState();

        if (
          currentState.isSaving ||
          currentState.isDirty
        ) {
          throw new Error(
            "Workflow could not be saved before execution."
          );
        }

        const execution =
          await executeWorkflowApi(
            workflowId
          );

        const nodesWithExecution =
          applyExecutionState(
            currentState.nodes,
            execution
          );

        set({
          isExecuting: false,
          executionError: null,
          execution,
          nodes: nodesWithExecution,

          selectedExecutionId: execution.id,
          selectedExecution: execution,
          isLoadingExecution: false,
          executionDetailError: null,
        });

        void useWorkflowEditorStore
          .getState()
          .loadExecutionHistory();
      } catch (error) {
        set({
          isExecuting: false,
          executionError:
            error instanceof Error
              ? error.message
              : "Failed to execute workflow.",
        });
      }
    },

    loadExecutionHistory: async () => {
      const state =
        useWorkflowEditorStore.getState();

      if (!state.workflowId) {
        return;
      }

      const workflowId =
        state.workflowId;

      set({
        isLoadingExecutionHistory: true,
        executionHistoryError: null,
      });

      try {
        const executionHistory =
          await getWorkflowExecutionsApi(
            workflowId
          );

        set({
          executionHistory,
          isLoadingExecutionHistory: false,
          executionHistoryError: null,
        });
      } catch (error) {
        set({
          isLoadingExecutionHistory: false,
          executionHistoryError:
            error instanceof Error
              ? error.message
              : "Failed to load execution history.",
        });
      }
    },

    selectExecution: (executionId) => {
      set({
        selectedExecutionId: executionId,
        selectedExecution: null,
        executionDetailError: null,
      });
    },

    loadExecution: async (
      executionId
    ) => {
      const state =
        useWorkflowEditorStore.getState();

      if (!state.workflowId) {
        return;
      }

      const workflowId =
        state.workflowId;

      set({
        selectedExecutionId:
          executionId,
        isLoadingExecution: true,
        executionDetailError: null,
      });

      try {
        const execution =
          await getWorkflowExecutionApi(
            workflowId,
            executionId
          );

        const normalizedExecution = {
          ...execution,
          node_executions:
            execution.node_executions ?? [],
        };

        set({
          selectedExecutionId: executionId,
          selectedExecution: normalizedExecution,
          isLoadingExecution: false,
          executionDetailError: null,
        });
      } catch (error) {
        set({
          isLoadingExecution: false,
          executionDetailError:
            error instanceof Error
              ? error.message
              : "Failed to load workflow execution.",
        });
      }
    },
  }));
