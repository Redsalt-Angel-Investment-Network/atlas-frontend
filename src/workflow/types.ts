import type { ComponentType } from "react";
import type { z } from "zod";

import type { NodeType } from "./registry";

export type NodeCategory =
  | "trigger"
  | "action"
  | "logic";

export type PortType =
  | "default"
  | "boolean"
  | "error";

export type NodePort = {
  id: string;
  label?: string;
  type?: PortType;
  multiple?: boolean;
};

export type NodeComponentProps = {
  nodeId: string;
  selected: boolean;
};

export type NodeFieldOption = {
  label: string;
  value: string;
};

export type NodeField =
  | {
      name: string;
      label: string;
      description?: string;
      type: "text" | "url" | "textarea" | "json";
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      description?: string;
      type: "number";
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
    }
  | {
      name: string;
      label: string;
      description?: string;
      type: "select";
      options: NodeFieldOption[];
    };

export type NodeConfigProps<TConfig = unknown> = {
  value: TConfig;
  onChange: (value: TConfig) => void;
};

export type NodeDefinition<TConfig = unknown> = {
  type: string;

  label: string;
  description?: string;

  category: NodeCategory;

  inputs: NodePort[];
  outputs: NodePort[];

  defaultConfig: TConfig;

  configSchema: z.ZodType<TConfig>;

  fields?: NodeField[];

  component?: ComponentType<NodeComponentProps>;

  configComponent?: ComponentType<NodeConfigProps<TConfig>>;
};

export type WorkflowNode = {
  id: string;

  type: NodeType;

  position: {
    x: number;
    y: number;
  };

  config: Record<string, unknown>;
};

export type WorkflowEdge = {
  id: string;

  source: string;
  sourceHandle?: string;

  target: string;
  targetHandle?: string;
};
