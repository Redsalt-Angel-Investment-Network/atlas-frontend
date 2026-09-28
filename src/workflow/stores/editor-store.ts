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
  updateWorkflowApi,
} from "@/app/(workspace)/workflows";


import { NodeType } from "../registry";
import { validateConnection } from "../validation/connection";
import {
  validateWorkflow,
  type WorkflowValidationIssue,
} from "../validation/workflow";


import { WorkflowExecutionResponse } from "@/_types/workflows";
// import { getWorkflowApi } from "@/app/(workspace)/workflows";

export type WorkflowNodeData = {
  type: NodeType;
  config: Record<string, unknown>;
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

export type WorkflowExecution = {
  id: string;
  status: string;
  output: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
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

const initialValidation = getValidationState(
  [],
  []
);

export const useWorkflowEditorStore =
  create<WorkflowEditorState>((set) => ({
    /*
     * Persistence editor starts empty.
     *
     * The workflow is populated by loadWorkflow().
     * Do not put demo nodes/edges here.
     */
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

        // Clear the previous graph immediately.
        nodes: [],
        edges: [],
        selectedNodeId: null,

        isDirty: false,
        changeCounter: 0,
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

          nodes,
          edges,

          selectedNodeId: null,

          isLoading: false,
          isSaving: false,
          isExecuting: false,
          isDirty: false,
          saveError: null,
          executionError: null,
          execution: null,

          changeCounter: 0,

          ...validation,
        });
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

      const nodes = structuredClone(
        state.nodes
      );

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

          /*
           * If the user edited while the
           * request was in flight, keep dirty=true.
           */
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

      set({
        isExecuting: true,
        executionError: null,
        execution: null,
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
            currentState.workflowId!
          );

        set({
          isExecuting: false,
          executionError: null,
          execution,
        });
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
  }));