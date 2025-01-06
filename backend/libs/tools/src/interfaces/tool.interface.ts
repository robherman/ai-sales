export interface ToolHandler {
  run(params: any, config?: any): Promise<any>;
}

// export interface ToolParameter {
//   name: string;
//   type: string;
//   description: string;
//   required: boolean;
// }

export enum ToolParameterType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
}

export interface ToolParameter {
  name: string;
  type: ToolParameterType;
  description: string;
  required: boolean;
  default?: any;
  items?: ToolParameter[]; // For array types
  properties?: ToolParameter[]; // For object types
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (args: any) => Promise<any>;
}

export interface ToolResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
