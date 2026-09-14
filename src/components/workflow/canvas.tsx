"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { WorkflowNode } from "./nodes/node";
import { useCallback, useState } from "react";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";
import { createWorkflowNode } from "@/workflow/factory/node";
import type { WorkflowFlowNode } from "@/workflow/stores/editor-store";
import { isNodeType } from "@/workflow/registry";

const nodeTypes = {
  workflow: WorkflowNode,
};

type WorkflowCanvasProps = {
  nodes: WorkflowFlowNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<WorkflowFlowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (nodeId: string) => void;
  onPaneClick?: () => void;
  onDrop?: (
    event: React.DragEvent,
    reactFlow: ReactFlowInstance
  ) => void;
};

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDrop,
}: WorkflowCanvasProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<WorkflowFlowNode, Edge> | null>(null);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const addNode = useWorkflowEditorStore(
    (state) => state.addNode
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/workflow-node"
      );

      if (
        !type ||
        !isNodeType(type) ||
        !reactFlowInstance
      ) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
  
      const node = createWorkflowNode(type, position);

      addNode({
        id: node.id,
        type: "workflow",
        position: node.position,
        data: {
          type: node.type,
          config: node.config,
        },
      });
    },
    [addNode, reactFlowInstance]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow<WorkflowFlowNode, Edge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}