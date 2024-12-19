import React, { useState, useEffect } from "react";
import { Handle, Position, NodeProps as ReactFlowNodeProps, useReactFlow } from "@xyflow/react"; // Import React Flow components.
import { NodeTemplate } from "../components/templates/NodeTemplate"; // Custom node template component.
import { FiTrash, FiPlus } from "react-icons/fi"; // Icons for the UI.
import { executeApiFetchNode } from "../utils/executeApiFetchNode"; // Utility function for executing API fetch requests.

interface ApiFetchNodeData {
  url: string; // API endpoint URL.
  method: "GET" | "POST" | "PUT" | "DELETE"; // HTTP method for the request.
  queryString: string; // Query string parameters.
  body: string; // Request body for POST/PUT methods.
  headers: { key: string; value: string }[]; // List of headers for the request.
  onExecute?: (inputData: any) => Promise<any>; // Optional execution callback.
  updateNodeData: (nodeId: string, newData: any) => void; // Function to update the node's data.
  pushToHistory: (nodes: unknown[], edges: unknown[]) => void; // Function to track history for undo/redo.
}

type NodeProps = ReactFlowNodeProps & {
  id: string; // Node ID.
  data: ApiFetchNodeData; // Node-specific data.
  selected: boolean; // Whether the node is selected.
};

// API Fetch Node component.
export const ApiFetchNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const [nodeData, setNodeData] = useState<ApiFetchNodeData>({ ...data }); // State to manage the node's data locally.
  const reactFlowInstance = useReactFlow(); // React Flow instance for managing nodes and edges.

  // Update the parent node with the execution logic.
  useEffect(() => {
    if (data.updateNodeData) {
      data.updateNodeData(id, {
        onExecute: () =>
          executeApiFetchNode({
            url: nodeData.url,
            method: nodeData.method,
            queryString: nodeData.queryString,
            body: nodeData.body,
            headers: nodeData.headers,
          }),
      });
    }
  }, [data.updateNodeData, id, nodeData]);

  // Update local state when the external data changes.
  useEffect(() => {
    setNodeData({ ...data });
  }, [data]);

  // Handle changes to the input fields and update the node's state in React Flow.
  const handleInputChange = (field: keyof ApiFetchNodeData, value: any) => {
    const updatedData = { ...nodeData, [field]: value };
    setNodeData(updatedData);

    // Update the node's data in React Flow.
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: updatedData } : node
      )
    );
  };

  // Add a new header to the list.
  const addHeader = () => {
    const updatedHeaders = [...nodeData.headers, { key: "", value: "" }];
    handleInputChange("headers", updatedHeaders);
  };

  // Remove a header by index.
  const removeHeader = (index: number) => {
    const updatedHeaders = nodeData.headers.filter((_, i) => i !== index);
    handleInputChange("headers", updatedHeaders);
  };

  // Update a specific header's key or value.
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const updatedHeaders = [...nodeData.headers];
    if (updatedHeaders[index]) {
      updatedHeaders[index][field] = value;
      handleInputChange("headers", updatedHeaders);
    }
  };

  return (
    <NodeTemplate
      type="ApiFetch"
      id={id}
      selected={selected}
      pushToHistory={nodeData.pushToHistory}
    >
      {/* Main content of the node */}
      <div className="flex flex-col gap-2 transition-all">
        {/* URL Input */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-normal text-gray-300">URL:</label>
          <input
            type="text"
            className="w-full p-1 border border-neutral-500 rounded"
            placeholder="Enter URL"
            value={nodeData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
          />
        </div>

        {/* Request Method Selector */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-normal text-gray-300">
            Request Method:
          </label>
          <select
            className="w-full p-1 border-[1px] border-neutral-500 rounded outline outline-neutral-500 border-r-8 border-transparent"
            value={nodeData.method}
            onChange={(e) => handleInputChange("method", e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Query String Input */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-normal text-gray-300">
            Query string:
          </label>
          <input
            type="text"
            className="w-full p-1 border border-neutral-500 rounded"
            placeholder="Enter query string"
            value={nodeData.queryString}
            onChange={(e) => handleInputChange("queryString", e.target.value)}
          />
        </div>

        {/* Body Input (only for POST/PUT) */}
        {(nodeData.method === "POST" || nodeData.method === "PUT") && (
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-normal text-gray-300">Body:</label>
            <textarea
              className="w-full p-2 border border-neutral-500 rounded"
              placeholder="Enter JSON body"
              value={nodeData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
            />
          </div>
        )}

        {/* Headers Section */}
        <div className="flex flex-col gap-1">
          {nodeData?.headers?.length > 0 && (
            <label className="block text-sm font-normal text-gray-300">
              Headers:
            </label>
          )}
          {nodeData?.headers?.map((header, index) => (
            <div key={index} className="flex flex-row space-x-2">
              {/* Header Key */}
              <input
                type="text"
                className="flex-1 p-1 border border-neutral-500 rounded"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, "key", e.target.value)}
              />
              {/* Header Value */}
              <input
                type="text"
                className="flex-1 p-1 border border-neutral-500 rounded"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, "value", e.target.value)}
              />
              {/* Remove Header Button */}
              <button
                className="text-white hover:text-red-500"
                onClick={() => removeHeader(index)}
              >
                <FiTrash />
              </button>
            </div>
          ))}

          {/* Add Header Button */}
          <div className="flex mt-3 justify-center items-center rounded">
            <div
              className="cursor-pointer py-1.5 flex justify-center items-center gap-2 text-md px-2 text-gray-300 bg-neutral-600 rounded"
              onClick={addHeader}
            >
              <FiPlus /> Add header
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "12px",
          height: "12px",
          background: "#3b3b3b",
          border: "1px solid #d1d5db",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "12px",
          height: "12px",
          background: "#3b3b3b",
          border: "1px solid #d1d5db",
        }}
      />
    </NodeTemplate>
  );
};
